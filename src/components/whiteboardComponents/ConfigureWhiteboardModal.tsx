import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { handleStartWhiteboard as sharedHandleStartWhiteboard, handleStopWhiteboard as sharedHandleStopWhiteboard } from 'mediasfu-shared';
import { getModalPosition } from '../../methods/utils/getModalPosition';
import { getModalBodyTheme } from '../../components_modern/core/modalBodyTheme';

const ConfigureWhiteboardModal = (props: any) => {
  const {
    isConfigureWhiteboardModalVisible,
    isVisible,
    onConfigureWhiteboardClose,
    backgroundColor,
    isDarkMode,
    position = 'center',
    renderMode = 'modal',
    style,
    renderContainer,
    parameters = {},
  } = props;

  const visible = Boolean(isConfigureWhiteboardModalVisible ?? isVisible);

  const {
    participants = [],
    itemPageLimit = 0,
    socket,
    islevel,
    roomName,
    shareScreenStarted,
    shared,
    updateShareScreenStarted,
    breakOutRoomStarted,
    breakOutRoomEnded,
    recordStarted,
    recordResumed,
    recordPaused,
    recordStopped,
    recordingMediaOptions,
    whiteboardStarted,
    whiteboardEnded,
    hostLabel,
    showAlert,

    updateWhiteboardStarted,
    updateWhiteboardEnded,
    updateWhiteboardUsers,
    updateCanStartWhiteboard,
    updateIsConfigureWhiteboardModalVisible,

    onScreenChanges,
    captureCanvasStream,
    prepopulateUserMedia,
    rePort,
  } = parameters;

  const [participantsCopy, setParticipantsCopy] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const theme = getModalBodyTheme(isDarkMode);
  const shouldUseModernTheme = typeof isDarkMode === 'boolean';
  const isEmbedded = renderMode === 'sidebar' || renderMode === 'inline';

  const whiteboardLimit = itemPageLimit || 0;

  const notify = (
    message: string,
    type: 'success' | 'danger' | 'warning' | 'info' = 'info'
  ) => {
    if (typeof showAlert === 'function') {
      showAlert({ message, type });
    }
  };

  const closeConfigureModal = () => {
    updateIsConfigureWhiteboardModalVisible?.(false);
    onConfigureWhiteboardClose?.();
  };

  const validateWhiteboard = (workingList: any[] = participantsCopy) => {
    const selectedParticipants = workingList.filter((participant) => participant?.useBoard);
    return selectedParticipants.length <= whiteboardLimit;
  };

  const checkCanStartWhiteboard = (workingList: any[] = participantsCopy) => {
    const isValid = validateWhiteboard(workingList);
    if (typeof updateCanStartWhiteboard === 'function') {
      updateCanStartWhiteboard(isValid);
    }
    return isValid;
  };

  useEffect(() => {
    if (!visible) return;
    const filteredParticipants = (participants || []).filter(
      (participant: any) => participant?.islevel !== '2'
    );
    setParticipantsCopy(filteredParticipants);
    checkCanStartWhiteboard(filteredParticipants);
  }, [visible, participants]);

  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') return;

    const handleWhiteboardUpdated = async (data: any) => {
      try {
        if (islevel === '2' && data?.members) {
          const filteredParticipants = data.members.filter(
            (participant: any) => !participant?.isBanned
          );
          setParticipantsCopy(filteredParticipants);
          checkCanStartWhiteboard(filteredParticipants);
        }

        if (typeof updateWhiteboardUsers === 'function') {
          updateWhiteboardUsers(data?.whiteboardUsers || []);
        }

        if (data?.status === 'started') {
          updateWhiteboardStarted?.(true);
          updateWhiteboardEnded?.(false);
          updateCanStartWhiteboard?.(false);
          closeConfigureModal();

          if (islevel !== '2') {
            updateShareScreenStarted?.(true);
            await onScreenChanges?.({ changed: true, parameters });
          } else if (parameters?.mainHeightWidth !== 84) {
            parameters?.updateMainHeightWidth?.(84);
            await onScreenChanges?.({ changed: true, parameters });
            await prepopulateUserMedia?.({ name: hostLabel, parameters });
          }
        } else if (data?.status === 'ended') {
          updateWhiteboardStarted?.(false);
          updateWhiteboardEnded?.(true);

          updateShareScreenStarted?.(false);
          await onScreenChanges?.({ changed: true, parameters });
          await prepopulateUserMedia?.({ name: hostLabel, parameters });
          await rePort?.({ restart: true, parameters });
        }
      } catch (error) {
        console.error('Error in whiteboardUpdated listener:', error);
      }
    };

    socket.on('whiteboardUpdated', handleWhiteboardUpdated);

    return () => {
      if (typeof socket.off === 'function') {
        socket.off('whiteboardUpdated', handleWhiteboardUpdated);
      }
    };
  }, [socket, islevel, hostLabel, onScreenChanges, prepopulateUserMedia, rePort, parameters]);

  const assignedParticipants = useMemo(
    () => participantsCopy.filter((participant) => participant?.useBoard),
    [participantsCopy]
  );

  const pendingParticipants = useMemo(
    () => participantsCopy.filter((participant) => !participant?.useBoard),
    [participantsCopy]
  );

  const selectedCount = assignedParticipants.length;
  const participantLimitLabel = whiteboardLimit > 0
    ? `${selectedCount}/${whiteboardLimit}`
    : `${selectedCount}`;
  const modalBackgroundColor = backgroundColor || (shouldUseModernTheme
    ? isDarkMode
      ? '#020617'
      : '#f8fafc'
    : '#1e293b');

  const renderEmptyState = (label: string) => (
    <View style={[styles.emptyState, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}>
      <Text style={[styles.emptyText, { color: theme.mutedTextColor }]}>{label}</Text>
    </View>
  );

  const renderParticipantRow = (participant: any, add: boolean) => (
    <TouchableOpacity
      key={`${add ? 'pending' : 'assigned'}-${participant.name}`}
      onPress={() => toggleParticipant(participant, add)}
      style={[styles.item, { backgroundColor: theme.inputBackgroundColor, borderColor: theme.borderColor }]}
    >
      <Text style={[styles.itemText, { color: theme.textColor }]} numberOfLines={1}>
        {participant.name}
      </Text>
      <View
        style={[
          styles.actionPill,
          {
            backgroundColor: add ? theme.badgeBackgroundColor : 'rgba(248, 113, 113, 0.14)',
            borderColor: add ? theme.accentColor : theme.dangerColor,
          },
        ]}
      >
        <Text style={[styles.actionText, { color: add ? theme.accentColor : theme.dangerColor }]}>
          {add ? 'Add' : 'Remove'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const toggleParticipant = (participant: any, add: boolean) => {
    setIsEditing(true);
    const selectedParticipants = participantsCopy.filter((p) => p?.useBoard);

    if (add && selectedParticipants.length >= Math.max(whiteboardLimit - 1, 0)) {
      notify(
        `Participant limit exceeded - you can only add ${Math.max(
          whiteboardLimit - 1,
          0
        )} other participants`,
        'danger'
      );
      return;
    }

    const updatedParticipants = participantsCopy.map((p) =>
      p?.name === participant?.name ? { ...p, useBoard: add } : p
    );

    setParticipantsCopy(updatedParticipants);
    checkCanStartWhiteboard(updatedParticipants);
  };

  const handleSaveWhiteboard = () => {
    if (validateWhiteboard()) {
      setIsEditing(false);
      updateCanStartWhiteboard?.(true);
      notify('Whiteboard saved successfully', 'success');
      return;
    }

    notify('Whiteboard validation failed', 'danger');
  };

  const handleStartWhiteboard = async () => {
    if ((shareScreenStarted || shared) && !whiteboardStarted) {
      notify('You cannot start whiteboard while screen sharing is active', 'danger');
      return;
    }

    if (breakOutRoomStarted && !breakOutRoomEnded) {
      notify('You cannot start whiteboard while breakout rooms are active', 'danger');
      return;
    }

    if (!checkCanStartWhiteboard() || !socket || typeof socket.emit !== 'function') {
      notify('Whiteboard validation failed', 'danger');
      return;
    }

    const filteredWhiteboardUsers = participantsCopy
      .filter((participant) => participant?.useBoard)
      .map(({ name, useBoard }: any) => ({ name, useBoard }));

    const started = await sharedHandleStartWhiteboard({
      socket,
      whiteboardUsers: filteredWhiteboardUsers,
      roomName,
      whiteboardStarted,
      whiteboardEnded,
      showAlert,
      updateWhiteboardStarted: updateWhiteboardStarted ?? (() => {}),
      updateWhiteboardEnded: updateWhiteboardEnded ?? (() => {}),
      updateIsConfigureWhiteboardModalVisible: updateIsConfigureWhiteboardModalVisible ?? (() => {}),
    });

    if (!started) {
      return;
    }

    updateWhiteboardStarted?.(true);
    updateWhiteboardEnded?.(false);
    updateWhiteboardUsers?.(filteredWhiteboardUsers);
    updateCanStartWhiteboard?.(false);
    closeConfigureModal();

    if (islevel !== '2') {
      updateShareScreenStarted?.(true);
      await onScreenChanges?.({ changed: true, parameters });
    }

    if (
      islevel === '2' &&
      (recordStarted || recordResumed) &&
      !(recordPaused || recordStopped) &&
      recordingMediaOptions === 'video'
    ) {
      await captureCanvasStream?.({ parameters });
    }
  };

  const handleStopWhiteboard = async () => {
    if (!socket || typeof socket.emit !== 'function') return;

    const stopped = await sharedHandleStopWhiteboard({
      socket,
      roomName,
      showAlert,
      updateWhiteboardStarted: updateWhiteboardStarted ?? (() => {}),
      updateWhiteboardEnded: updateWhiteboardEnded ?? (() => {}),
      updateIsConfigureWhiteboardModalVisible: updateIsConfigureWhiteboardModalVisible ?? (() => {}),
    });

    if (!stopped) {
      return;
    }

    updateShareScreenStarted?.(false);
    await onScreenChanges?.({ changed: true, parameters });
    await prepopulateUserMedia?.({ name: hostLabel, parameters });
    await rePort?.({ restart: true, parameters });
    closeConfigureModal();
  };

  const dimensions = { width: 520, height: 0 };

  const content = (
    <View style={[isEmbedded ? styles.embeddedContainer : styles.container, { backgroundColor: isEmbedded ? 'transparent' : modalBackgroundColor }, shouldUseModernTheme ? { borderColor: theme.borderColor, borderWidth: isEmbedded ? 0 : 1 } : null, style]}>
          <View style={styles.header}>
            <View style={styles.headerTextGroup}>
              <Text style={[styles.title, { color: theme.textColor }]}>Configure Whiteboard</Text>
              <Text style={[styles.subtitle, { color: theme.mutedTextColor }]}>Participants with board access</Text>
            </View>
            <View style={[styles.countBadge, { backgroundColor: theme.badgeBackgroundColor, borderColor: theme.borderColor }]}>
              <Text style={[styles.countBadgeText, { color: theme.badgeTextColor }]}>{participantLimitLabel}</Text>
            </View>
          </View>

          <ScrollView style={styles.listWrapper} contentContainerStyle={styles.listContent}>
            <View style={[styles.sectionCard, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Assigned</Text>
                <Text style={[styles.sectionCount, { color: theme.mutedTextColor }]}>{assignedParticipants.length}</Text>
              </View>
              {assignedParticipants.length > 0
                ? assignedParticipants.map((participant) => renderParticipantRow(participant, false))
                : renderEmptyState('No one is assigned yet')}
            </View>

            <View style={[styles.sectionCard, { borderColor: theme.borderColor, backgroundColor: theme.rowBackgroundColor }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Pending</Text>
                <Text style={[styles.sectionCount, { color: theme.mutedTextColor }]}>{pendingParticipants.length}</Text>
              </View>
              {pendingParticipants.length > 0
                ? pendingParticipants.map((participant) => renderParticipantRow(participant, true))
                : renderEmptyState('No pending participants')}
            </View>
          </ScrollView>

          <View style={styles.actionsRow}>
            <TouchableOpacity onPress={handleSaveWhiteboard} style={[styles.buttonSecondary, { backgroundColor: theme.inputBackgroundColor, borderColor: theme.borderColor }]}> 
              <Text style={[styles.buttonText, { color: theme.textColor }]}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleStartWhiteboard} style={styles.buttonPrimary}>
              <Text style={styles.buttonText}>{whiteboardStarted && !whiteboardEnded ? 'Update' : 'Start'}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleStopWhiteboard} style={styles.buttonDanger}>
              <Text style={styles.buttonText}>Stop</Text>
            </TouchableOpacity>
          </View>

          {!isEmbedded && (
            <TouchableOpacity
              style={[styles.buttonSecondary, styles.closeButton, { backgroundColor: theme.inputBackgroundColor, borderColor: theme.borderColor }]}
              onPress={closeConfigureModal}
            >
              <Text style={[styles.buttonText, { color: theme.textColor }]}>{isEditing ? 'Close (Unsaved edits)' : 'Close'}</Text>
            </TouchableOpacity>
          )}
        </View>
  );

  if (isEmbedded) {
    return visible ? content : null;
  }

  const defaultContainer = (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onConfigureWhiteboardClose}>
      <View style={[styles.overlay, getModalPosition({ position })]}>
        {content}
      </View>
    </Modal>
  );

  return renderContainer
    ? (renderContainer({ defaultContainer, dimensions }) as JSX.Element)
    : defaultContainer;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    margin: 16,
    borderRadius: 16,
    padding: 18,
    maxHeight: '85%',
  },
  embeddedContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 2,
    paddingBottom: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  } as any,
  headerTextGroup: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  countBadge: {
    minWidth: 58,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  listWrapper: {
    maxHeight: 420,
    marginBottom: 14,
  },
  listContent: {
    gap: 12,
    paddingBottom: 2,
  } as any,
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#cbd5e1',
    fontSize: 15,
    fontWeight: '800',
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '800',
  },
  emptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    gap: 10,
  } as any,
  actionPill: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  itemText: {
    color: '#fff',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  actionText: {
    color: '#93c5fd',
    fontSize: 12,
    fontWeight: '800',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: '#475569',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonDanger: {
    flex: 1,
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeButton: {
    flex: 0,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ConfigureWhiteboardModal;
