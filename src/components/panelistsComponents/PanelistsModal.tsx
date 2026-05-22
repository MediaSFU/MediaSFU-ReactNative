import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Socket } from 'socket.io-client';
import { Participant, ShowAlert } from '../../@types/types';
import { addPanelist, removePanelist, focusPanelists } from '../../methods/panelistsMethods';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { getModalBodyTheme } from '../../components_modern/core/modalBodyTheme';

export interface PanelistsModalParameters {
  participants: Participant[];
  panelists: Participant[];
  member: string;
  islevel: string;
  socket: Socket;
  roomName: string;
  showAlert?: ShowAlert;
  itemPageLimit: number;
  panelistsFocused?: boolean;
  updatePanelists?: (panelists: Participant[]) => void;
  updatePanelistsFocused?: (focused: boolean) => void;
  getUpdatedAllParams: () => PanelistsModalParameters;
}

export interface PanelistsModalOptions {
  isPanelistsModalVisible: boolean;
  onPanelistsClose: () => void;
  parameters: PanelistsModalParameters;
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

export type PanelistsModalType = (options: PanelistsModalOptions) => React.JSX.Element;

const { width, height } = Dimensions.get('window');

const PanelistsModal: React.FC<PanelistsModalOptions> = ({
  isPanelistsModalVisible,
  onPanelistsClose,
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
    panelists: initialPanelists,
    member,
    islevel,
    socket,
    roomName,
    showAlert,
    itemPageLimit,
    panelistsFocused: initialFocused = false,
    updatePanelists,
    updatePanelistsFocused,
    getUpdatedAllParams,
  } = parameters;

  const [searchFilter, setSearchFilter] = useState('');
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants || []);
  const [localPanelists, setLocalPanelists] = useState<Participant[]>(initialPanelists || []);
  const [isFocused, setIsFocused] = useState<boolean>(initialFocused);
  const [muteOthersMic, setMuteOthersMic] = useState<boolean>(false);
  const [muteOthersCamera, setMuteOthersCamera] = useState<boolean>(false);

  useEffect(() => {
    if (!isPanelistsModalVisible) {
      return;
    }
    const fresh = getUpdatedAllParams?.() || parameters;
    setParticipants(fresh.participants || []);
    setLocalPanelists(fresh.panelists || []);
    setIsFocused(!!fresh.panelistsFocused);
  }, [getUpdatedAllParams, isPanelistsModalVisible, parameters]);

  const isHost = islevel === '2';

  const panelistIds = useMemo(() => new Set(localPanelists.map((p) => p.id)), [localPanelists]);

  const availableParticipants = useMemo(
    () =>
      participants
        .filter((p) => p.islevel !== '2' && p.name !== member)
        .filter((p) => !panelistIds.has(p.id))
        .filter((p) => (searchFilter ? p.name.toLowerCase().includes(searchFilter.toLowerCase()) : true)),
    [member, panelistIds, participants, searchFilter],
  );

  const onAdd = useCallback(
    async (participant: Participant) => {
      const success = await addPanelist({
        socket,
        participant,
        currentPanelists: localPanelists,
        maxPanelists: itemPageLimit,
        roomName,
        member,
        islevel,
        showAlert,
      });

      if (!success) {
        return;
      }
      const next = [...localPanelists, participant];
      setLocalPanelists(next);
      updatePanelists?.(next);
    },
    [islevel, itemPageLimit, localPanelists, member, roomName, showAlert, socket, updatePanelists],
  );

  const onRemove = useCallback(
    async (participant: Participant) => {
      await removePanelist({
        socket,
        participant,
        roomName,
        member,
        islevel,
        showAlert,
      });
      const next = localPanelists.filter((p) => p.id !== participant.id);
      setLocalPanelists(next);
      updatePanelists?.(next);
    },
    [islevel, localPanelists, member, roomName, showAlert, socket, updatePanelists],
  );

  const onToggleFocus = useCallback(async () => {
    const next = !isFocused;
    await focusPanelists({
      socket,
      roomName,
      member,
      islevel,
      focusEnabled: next,
      muteOthersMic: next ? muteOthersMic : false,
      muteOthersCamera: next ? muteOthersCamera : false,
      showAlert,
    });
    setIsFocused(next);
    updatePanelistsFocused?.(next);
  }, [
    isFocused,
    islevel,
    member,
    muteOthersCamera,
    muteOthersMic,
    roomName,
    showAlert,
    socket,
    updatePanelistsFocused,
  ]);

  if (!isPanelistsModalVisible) {
    return null;
  }

  const isEmbedded = renderMode === 'sidebar' || renderMode === 'inline';

  const content = (
    <>
      <View style={isEmbedded ? styles.embeddedHeader : styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIcon, isEmbedded && styles.embeddedHeaderIcon]}>
            <FontAwesome5 name="user-tie" size={16} color={isEmbedded ? theme.accentColor : '#fff'} />
          </View>
          <View>
            <Text style={[isEmbedded ? styles.embeddedTitle : styles.headerTitle, { color: isEmbedded ? theme.textColor : '#fff' }]}>Panelists</Text>
            {isEmbedded && <Text style={[styles.embeddedSubtitle, { color: theme.mutedTextColor }]}>Focus and presenter access</Text>}
          </View>
        </View>
        {!isEmbedded && (
          <TouchableOpacity style={styles.closeButton} onPress={onPanelistsClose}>
            <FontAwesome5 name="times" size={14} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
            {isHost && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Focus mode</Text>
                <TouchableOpacity style={[styles.switchRow, { backgroundColor: theme.rowBackgroundColor }]} onPress={onToggleFocus}>
                  <Text style={[styles.lightText, { color: theme.mutedTextColor }]}>{isFocused ? 'Disable focus on panelists' : 'Enable focus on panelists'}</Text>
                </TouchableOpacity>
                {isFocused && (
                  <View>
                    <TouchableOpacity style={[styles.switchRow, { backgroundColor: theme.rowBackgroundColor }]} onPress={() => setMuteOthersMic((v) => !v)}>
                      <Text style={[styles.lightText, { color: theme.mutedTextColor }]}>Mute others' microphone</Text>
                      <Text style={[styles.lightText, { color: theme.mutedTextColor }]}>{muteOthersMic ? 'ON' : 'OFF'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.switchRow, { backgroundColor: theme.rowBackgroundColor }]} onPress={() => setMuteOthersCamera((v) => !v)}>
                      <Text style={[styles.lightText, { color: theme.mutedTextColor }]}>Mute others' camera</Text>
                      <Text style={[styles.lightText, { color: theme.mutedTextColor }]}>{muteOthersCamera ? 'ON' : 'OFF'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Current panelists ({localPanelists.length}/{itemPageLimit})</Text>
              {localPanelists.length === 0 ? (
                <Text style={[styles.emptyText, { color: theme.mutedTextColor }]}>No panelists selected</Text>
              ) : (
                localPanelists.map((p) => (
                  <View key={p.id || p.name} style={[styles.participantItem, { backgroundColor: theme.rowBackgroundColor }]}> 
                    <Text style={[styles.participantName, { color: theme.textColor }]}>{p.name}</Text>
                    {isHost && (
                      <TouchableOpacity style={styles.actionBtn} onPress={() => onRemove(p)}>
                        <FontAwesome5 name="minus" size={12} color="#f472b6" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>

            {isHost && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Add participants</Text>
                <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor, borderColor: theme.borderColor, borderWidth: 1 }]}> 
                  <FontAwesome5 name="search" size={13} color={theme.mutedTextColor} />
                  <TextInput
                    style={[styles.searchInput, { color: theme.inputTextColor }]}
                    placeholder="Search participants..."
                    placeholderTextColor={theme.placeholderTextColor}
                    value={searchFilter}
                    onChangeText={setSearchFilter}
                  />
                </View>

                {availableParticipants.length === 0 ? (
                  <Text style={[styles.emptyText, { color: theme.mutedTextColor }]}>No participants found</Text>
                ) : (
                  availableParticipants.map((p) => (
                    <View key={p.id || p.name} style={[styles.participantItem, { backgroundColor: theme.rowBackgroundColor }]}> 
                      <Text style={[styles.participantName, { color: theme.textColor }]}>{p.name}</Text>
                      <TouchableOpacity style={styles.actionBtn} onPress={() => onAdd(p)}>
                        <FontAwesome5 name="plus" size={12} color="#22d3ee" />
                      </TouchableOpacity>
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
    <Modal visible={isPanelistsModalVisible} transparent animationType="fade" onRequestClose={onPanelistsClose}>
      <TouchableOpacity style={[styles.overlay, getModalPosition({ position })]} activeOpacity={1} onPress={onPanelistsClose}>
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
  modalContainer: {
    width: Math.min(460, width * 0.92),
    maxHeight: height * 0.88,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  embeddedContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderRadius: 0,
    overflow: 'hidden',
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#7c3aed' },
  embeddedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148,163,184,0.22)',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { alignItems: 'center', justifyContent: 'center' },
  embeddedHeaderIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(56,189,248,0.12)',
    marginRight: 10,
  },
  headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700', marginLeft: 10 },
  embeddedTitle: { fontSize: 17, fontWeight: '700' },
  embeddedSubtitle: { fontSize: 12, marginTop: 2 },
  closeButton: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 8 },
  content: { flex: 1 },
  contentInner: { padding: 14, paddingBottom: 22 },
  section: { marginBottom: 18 },
  sectionTitle: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 8 },
  lightText: { color: '#e2e8f0', fontSize: 13 },
  emptyText: { color: 'rgba(255,255,255,0.55)', fontSize: 13 },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: { flex: 1, color: '#fff', paddingVertical: 10, paddingHorizontal: 8 },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  participantName: { color: '#fff', fontSize: 14 },
  actionBtn: { backgroundColor: 'rgba(15,23,42,0.6)', borderRadius: 6, padding: 8 },
});

export default PanelistsModal;
