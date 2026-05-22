import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, ScrollView, Dimensions } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Socket } from 'socket.io-client';
import { Participant, ShowAlert, CoHostResponsibility } from '../../@types/types';
import { updateParticipantPermission } from '../../methods/permissionsMethods';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { getModalBodyTheme } from '../../components_modern/core/modalBodyTheme';

export interface PermissionsModalParameters {
  participants: Participant[];
  member: string;
  islevel: string;
  socket: Socket;
  roomName: string;
  showAlert?: ShowAlert;
  coHostResponsibility?: CoHostResponsibility[];
  updateCoHostResponsibility?: (responsibilities: CoHostResponsibility[]) => void;
  getUpdatedAllParams: () => PermissionsModalParameters;
}

export interface PermissionsModalOptions {
  isPermissionsModalVisible: boolean;
  onPermissionsClose: () => void;
  parameters: PermissionsModalParameters;
  backgroundColor?: string;
  isDarkMode?: boolean;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  style?: object;
  renderMode?: 'modal' | 'sidebar' | 'inline';
  renderContainer?: (options: {
    defaultContainer: React.ReactNode;
    dimensions: { width: number; height: number };
  }) => React.ReactNode;
}

export type PermissionsModalType = (options: PermissionsModalOptions) => React.JSX.Element;

const { width, height } = Dimensions.get('window');

const PermissionsModal: React.FC<PermissionsModalOptions> = ({
  isPermissionsModalVisible,
  onPermissionsClose,
  parameters,
  backgroundColor = '#1e293b',
  isDarkMode,
  position = 'center',
  style,
  renderMode = 'modal',
  renderContainer,
}) => {
  const theme = getModalBodyTheme(isDarkMode);
  const {
    participants: initialParticipants,
    member,
    islevel,
    socket,
    roomName,
    showAlert,
    coHostResponsibility: initialCoHostResponsibility = [],
    updateCoHostResponsibility,
    getUpdatedAllParams,
  } = parameters;

  const [searchFilter, setSearchFilter] = useState('');
  const [participantsState, setParticipantsState] = useState<Participant[]>(initialParticipants || []);
  const [coHostResponsibility, setCoHostResponsibility] = useState<CoHostResponsibility[]>(initialCoHostResponsibility);

  useEffect(() => {
    if (isPermissionsModalVisible && getUpdatedAllParams) {
      const freshParams = getUpdatedAllParams();
      setParticipantsState(freshParams.participants || []);
      if (freshParams.coHostResponsibility) {
        setCoHostResponsibility(freshParams.coHostResponsibility);
      }
    }
  }, [getUpdatedAllParams, isPermissionsModalVisible]);

  const participants = participantsState;

  const availableParticipants = useMemo(() => {
    return participants
      .filter((p) => p.islevel !== '2' && p.name !== member)
      .filter((p) => (searchFilter ? p.name.toLowerCase().includes(searchFilter.toLowerCase()) : true));
  }, [participants, member, searchFilter]);

  const isHost = islevel === '2';

  const toggleCoHostResponsibility = (item: CoHostResponsibility) => {
    const updated = coHostResponsibility.map((r) => r.name === item.name ? { ...r, value: !r.value } : r);
    setCoHostResponsibility(updated);
    updateCoHostResponsibility?.(updated);
  };

  const handleTogglePermission = useCallback(
    async (participant: Participant, action: 'audio' | 'video' | 'screenshare' | 'chat') => {
      const nextLevel = participant.islevel === '1' ? '0' : '1';
      if (action === 'audio' || action === 'video' || action === 'screenshare' || action === 'chat') {
        await updateParticipantPermission({
          socket,
          participant,
          newLevel: nextLevel,
          member,
          islevel,
          roomName,
          showAlert,
        });
      }
    },
    [socket, roomName, member, islevel, showAlert],
  );

  if (!isPermissionsModalVisible) {
    return null;
  }

  const isEmbedded = renderMode === 'sidebar' || renderMode === 'inline';

  const content = (
    <>
      <View style={isEmbedded ? styles.embeddedHeader : styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIcon, isEmbedded && styles.embeddedHeaderIcon]}>
            <FontAwesome5 name="user-shield" size={16} color={isEmbedded ? theme.accentColor : 'white'} />
          </View>
          <View>
            <Text style={[isEmbedded ? styles.embeddedTitle : styles.headerTitle, { color: isEmbedded ? theme.textColor : 'white' }]}>Permissions</Text>
            {isEmbedded && <Text style={[styles.embeddedSubtitle, { color: theme.mutedTextColor }]}>Participant access and roles</Text>}
          </View>
        </View>
        {!isEmbedded && (
          <TouchableOpacity onPress={onPermissionsClose} style={styles.closeButton}>
            <FontAwesome5 name="times" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
            {isHost && coHostResponsibility.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Co-Host Roles</Text>
                <View style={styles.rolesList}>
                  {coHostResponsibility.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => toggleCoHostResponsibility(item)} style={styles.roleItem}>
                      <View style={[styles.checkbox, item.value && styles.checkboxChecked]}>
                         {item.value && <FontAwesome5 name="check" size={10} color="white" />}
                      </View>
                      <Text style={[styles.roleText, { color: theme.textColor }]}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {isHost && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Participant Level Access</Text>
                
                <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor, borderColor: theme.borderColor, borderWidth: 1 }]}> 
                  <FontAwesome5 name="search" size={14} color={theme.mutedTextColor} style={styles.searchIcon} />
                  <TextInput
                    style={[styles.searchInput, { color: theme.inputTextColor }]}
                    placeholder="Search participants..."
                    placeholderTextColor={theme.placeholderTextColor}
                    value={searchFilter}
                    onChangeText={setSearchFilter}
                  />
                  {searchFilter.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchFilter('')}>
                      <FontAwesome5 name="times-circle" size={14} color={theme.mutedTextColor} />
                    </TouchableOpacity>
                  )}
                </View>

                {availableParticipants.length === 0 ? (
                  <Text style={[styles.emptyText, { color: theme.mutedTextColor }]}>No participants found</Text>
                ) : (
                  availableParticipants.map((p) => (
                    <View key={p.id} style={[styles.participantItem, { backgroundColor: theme.rowBackgroundColor }]}> 
                      <Text style={[styles.participantName, { color: theme.textColor }]}>{p.name}</Text>
                      <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleTogglePermission(p, 'audio')}>
                           <FontAwesome5 name="microphone" size={14} color="#a855f7" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleTogglePermission(p, 'video')}>
                           <FontAwesome5 name="video" size={14} color="#a855f7" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
      </ScrollView>
    </>
  );

  if (isEmbedded) {
    return (
      <View style={[styles.embeddedContainer, { backgroundColor, borderColor: theme.borderColor }, style]}>
        {content}
      </View>
    );
  }

  const defaultContainer = (
    <Modal visible={isPermissionsModalVisible} transparent={true} animationType="fade" onRequestClose={onPermissionsClose}>
      <TouchableOpacity style={[styles.overlay, getModalPosition({ position })]} activeOpacity={1} onPress={onPermissionsClose}>
        <TouchableOpacity style={[styles.modalContainer, { backgroundColor, borderColor: theme.borderColor }, style]} activeOpacity={1}>
          {content}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  return renderContainer
    ? (renderContainer({ defaultContainer, dimensions: { width, height } }) as React.JSX.Element)
    : defaultContainer;
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: Math.min(450, width * 0.9), maxHeight: height * 0.85, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  embeddedContainer: { flex: 1, width: '100%', height: '100%', borderRadius: 0, borderWidth: 0, overflow: 'hidden' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#8b5cf6' },
  embeddedHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(148,163,184,0.22)' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { alignItems: 'center', justifyContent: 'center' },
  embeddedHeaderIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(56,189,248,0.12)', marginRight: 10 },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '600', marginLeft: 10 },
  embeddedTitle: { fontSize: 18, fontWeight: '700' },
  embeddedSubtitle: { fontSize: 12, marginTop: 2 },
  closeButton: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8 },
  content: { flex: 1 },
  contentInner: { padding: 16, paddingBottom: 22 },
  section: { marginBottom: 20 },
  sectionTitle: { color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  rolesList: { flexDirection: 'row', flexWrap: 'wrap' },
  roleItem: { flexDirection: 'row', alignItems: 'center', width: '45%', marginBottom: 10 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  checkboxChecked: { backgroundColor: '#8b5cf6', borderColor: '#8b5cf6' },
  roleText: { color: 'white', fontSize: 14 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8, paddingHorizontal: 12, height: 40, marginBottom: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: 'white' },
  emptyText: { color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: 20 },
  participantItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 8, marginBottom: 8 },
  participantName: { color: 'white', fontSize: 15 },
  actionRow: { flexDirection: 'row' },
  actionBtn: { backgroundColor: 'rgba(139,92,246,0.15)', padding: 8, borderRadius: 6, marginLeft: 8 },
});

export default PermissionsModal;
