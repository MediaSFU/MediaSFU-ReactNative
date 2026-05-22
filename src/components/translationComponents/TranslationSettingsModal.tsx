import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import type { Socket } from 'socket.io-client';
import { getLanguageName, getCommonLanguages } from 'mediasfu-shared';
import type {
  LanguageEntry,
  LanguageMode,
  TranslationRoomConfig,
} from '../../producers/socketReceiveMethods/translationReceiveMethods';
import type { Participant, ShowAlert } from '../../@types/types';
import {
  createThemedPickerSelectStyles,
  getModalBodyTheme,
} from '../../components_modern/core/modalBodyTheme';
import { getModalPosition } from '../../methods/utils/getModalPosition';

type PickerItem = {
  label: string;
  value: string | null;
};

interface TranslationSettingsModalProps {
  isTranslationSettingsModalVisible?: boolean;
  onTranslationSettingsClose?: () => void;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  isDarkMode?: boolean;
  position?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center';
  renderContainer?: (options: {
    defaultContainer: React.ReactElement;
    dimensions: { width: number; height: number };
  }) => React.ReactNode;
  translationConfig?: TranslationRoomConfig | null;
  member?: string;
  participants?: Participant[];
  audioProducerId?: string | null;
  mySpokenLanguage?: string;
  mySpokenLanguageEnabled?: boolean;
  myDefaultOutputLanguage?: string | null;
  myDefaultListenLanguage?: string | null;
  listenPreferences?: Map<string, string>;
  updateMySpokenLanguage?: (value: string) => void;
  updateMySpokenLanguageEnabled?: (value: boolean) => void;
  updateMyDefaultOutputLanguage?: (value: string | null) => void;
  applyGlobalListenLanguage?: (language: string | null) => Promise<void>;
  applySpeakerListenPreference?: (
    speakerId: string,
    language: string | null
  ) => Promise<void>;
  clearSpeakerListenPreference?: (speakerId: string) => Promise<void>;
  showSubtitlesOnCards?: boolean;
  updateShowSubtitlesOnCards?: (value: boolean) => void;
  roomName?: string;
  socket?: Socket | null;
  showAlert?: ShowAlert;
}

const dedupe = (codes: string[]) =>
  Array.from(new Set(codes.map((code) => code.toLowerCase())));

const buildLanguageItems = ({
  mode,
  allowedLanguages,
  blockedLanguages,
  includeAuto = false,
}: {
  mode?: LanguageMode;
  allowedLanguages?: LanguageEntry[];
  blockedLanguages?: string[];
  includeAuto?: boolean;
}): PickerItem[] => {
  const supported = new Map(
    getCommonLanguages('en').map((option) => [option.code.toLowerCase(), option])
  );

  let codes =
    mode === 'allowlist' && allowedLanguages?.length
      ? allowedLanguages.map((entry) => entry.code)
      : Array.from(supported.keys());

  if (mode === 'blocklist' && blockedLanguages?.length) {
    const blocked = new Set(blockedLanguages.map((code) => code.toLowerCase()));
    codes = codes.filter((code) => !blocked.has(code.toLowerCase()));
  }

  if (!includeAuto) {
    codes = codes.filter((code) => code.toLowerCase() !== 'auto');
  }

  return dedupe(codes)
    .map((code) => ({
      label: getLanguageName(code),
      value: code,
    }))
    .sort((left, right) => left.label.localeCompare(right.label));
};

const areMapsEqual = (left: Map<string, string>, right: Map<string, string>) => {
  if (left.size !== right.size) {
    return false;
  }

  for (const [key, value] of left) {
    if (right.get(key) !== value) {
      return false;
    }
  }

  return true;
};

const resolveSpeakerId = (participant: Participant) =>
  participant.id || participant.audioID || participant.name;

const TranslationSettingsModal: React.FC<TranslationSettingsModalProps> = ({
  isTranslationSettingsModalVisible = false,
  onTranslationSettingsClose,
  backgroundColor,
  style,
  isDarkMode,
  position = 'center',
  renderContainer,
  translationConfig,
  member,
  participants = [],
  audioProducerId,
  mySpokenLanguage = 'en',
  mySpokenLanguageEnabled = false,
  myDefaultOutputLanguage = null,
  myDefaultListenLanguage = null,
  listenPreferences = new Map(),
  updateMySpokenLanguage,
  updateMySpokenLanguageEnabled,
  updateMyDefaultOutputLanguage,
  applyGlobalListenLanguage,
  applySpeakerListenPreference,
  clearSpeakerListenPreference,
  showSubtitlesOnCards = true,
  updateShowSubtitlesOnCards,
  roomName,
  socket,
  showAlert,
}) => {
  const [localSpokenLanguage, setLocalSpokenLanguage] = useState(mySpokenLanguage);
  const [localSpokenEnabled, setLocalSpokenEnabled] = useState(
    mySpokenLanguageEnabled
  );
  const [localDefaultOutputLanguage, setLocalDefaultOutputLanguage] = useState<
    string | null
  >(myDefaultOutputLanguage);
  const [localDefaultListenLanguage, setLocalDefaultListenLanguage] = useState<
    string | null
  >(myDefaultListenLanguage);
  const [localListenPreferences, setLocalListenPreferences] = useState(
    new Map(listenPreferences)
  );
  const [perSpeakerMode, setPerSpeakerMode] = useState(
    listenPreferences.size > 0 && myDefaultListenLanguage === null
  );
  const [localShowSubtitles, setLocalShowSubtitles] = useState(
    showSubtitlesOnCards
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'speaking' | 'listening'>('speaking');
  const hasInitializedVisibleSession = useRef(false);

  useEffect(() => {
    if (!isTranslationSettingsModalVisible) {
      hasInitializedVisibleSession.current = false;
      return;
    }

    if (hasInitializedVisibleSession.current) {
      return;
    }

    setLocalSpokenLanguage(mySpokenLanguage);
    setLocalSpokenEnabled(mySpokenLanguageEnabled);
    setLocalDefaultOutputLanguage(myDefaultOutputLanguage);
    setLocalDefaultListenLanguage(myDefaultListenLanguage);
    setLocalListenPreferences(new Map(listenPreferences));
    setPerSpeakerMode(listenPreferences.size > 0 && myDefaultListenLanguage === null);
    setLocalShowSubtitles(showSubtitlesOnCards);
    hasInitializedVisibleSession.current = true;
  }, [
    isTranslationSettingsModalVisible,
    listenPreferences,
    myDefaultListenLanguage,
    myDefaultOutputLanguage,
    mySpokenLanguage,
    mySpokenLanguageEnabled,
    showSubtitlesOnCards,
  ]);

  const theme = getModalBodyTheme(isDarkMode);
  const themedPickerSelectStyles = createThemedPickerSelectStyles(theme);

  const spokenLanguageItems = useMemo(
    () =>
      buildLanguageItems({
        mode: translationConfig?.spokenLanguageMode,
        allowedLanguages: translationConfig?.allowedSpokenLanguages,
        blockedLanguages: translationConfig?.blockedSpokenLanguages,
        includeAuto: translationConfig?.autoDetectSpokenLanguage,
      }),
    [translationConfig]
  );

  const listenLanguageItems = useMemo(
    () =>
      buildLanguageItems({
        mode: translationConfig?.listenLanguageMode,
        allowedLanguages: translationConfig?.allowedListenLanguages,
        blockedLanguages: translationConfig?.blockedListenLanguages,
      }),
    [translationConfig]
  );

  const speakerRows = useMemo(
    () =>
      participants.filter(
        (participant) =>
          participant.name &&
          participant.name !== member &&
          Boolean(resolveSpeakerId(participant))
      ),
    [member, participants]
  );

  const spokenChangeDisabled = translationConfig?.allowSpokenLanguageChange === false;
  const listenChangeDisabled = translationConfig?.allowListenLanguageChange === false;

  const hasChanges =
    localSpokenLanguage !== mySpokenLanguage ||
    localSpokenEnabled !== mySpokenLanguageEnabled ||
    localDefaultOutputLanguage !== myDefaultOutputLanguage ||
    localShowSubtitles !== showSubtitlesOnCards ||
    (perSpeakerMode
      ? myDefaultListenLanguage !== null ||
        !areMapsEqual(localListenPreferences, listenPreferences)
      : localDefaultListenLanguage !== myDefaultListenLanguage ||
        listenPreferences.size > 0);

  if (!isTranslationSettingsModalVisible) {
    return null;
  }

  const handleSpeakerPreferenceChange = (
    speakerId: string,
    language: string | null
  ) => {
    setLocalListenPreferences((prev) => {
      const next = new Map(prev);

      if (language) {
        next.set(speakerId, language);
      } else {
        next.delete(speakerId);
      }

      return next;
    });
  };

  const handleSave = async () => {
    const canUpdateTranslation = Boolean(socket && roomName);
    const onlySubtitleChanged =
      localShowSubtitles !== showSubtitlesOnCards &&
      localSpokenLanguage === mySpokenLanguage &&
      localSpokenEnabled === mySpokenLanguageEnabled &&
      localDefaultOutputLanguage === myDefaultOutputLanguage &&
      localDefaultListenLanguage === myDefaultListenLanguage &&
      areMapsEqual(localListenPreferences, listenPreferences);

    if (!canUpdateTranslation && !onlySubtitleChanged) {
      showAlert?.({
        message: 'Translation settings are unavailable until the room connection is ready.',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    setIsSaving(true);

    try {
      if (
        canUpdateTranslation &&
        (localSpokenLanguage !== mySpokenLanguage ||
          localSpokenEnabled !== mySpokenLanguageEnabled ||
          localDefaultOutputLanguage !== myDefaultOutputLanguage)
      ) {
        socket?.emit('translation:setMyLanguage', {
          roomName,
          language: localSpokenLanguage,
          defaultOutputLanguage: localDefaultOutputLanguage,
          enabled: localSpokenEnabled,
          producerId: audioProducerId,
        });

        updateMySpokenLanguage?.(localSpokenLanguage);
        updateMySpokenLanguageEnabled?.(localSpokenEnabled);
        updateMyDefaultOutputLanguage?.(localDefaultOutputLanguage);
      }

      if (canUpdateTranslation) {
        if (!perSpeakerMode) {
          for (const [speakerId] of listenPreferences) {
            await clearSpeakerListenPreference?.(speakerId);
          }

          if (
            localDefaultListenLanguage !== myDefaultListenLanguage ||
            listenPreferences.size > 0
          ) {
            await applyGlobalListenLanguage?.(localDefaultListenLanguage);
          }
        } else {
          if (myDefaultListenLanguage !== null) {
            await applyGlobalListenLanguage?.(null);
          }

          for (const [speakerId, language] of localListenPreferences) {
            if (listenPreferences.get(speakerId) !== language) {
              await applySpeakerListenPreference?.(speakerId, language);
            }
          }

          for (const [speakerId] of listenPreferences) {
            if (!localListenPreferences.has(speakerId)) {
              await clearSpeakerListenPreference?.(speakerId);
            }
          }
        }
      }

      if (localShowSubtitles !== showSubtitlesOnCards) {
        updateShowSubtitlesOnCards?.(localShowSubtitles);
      }

      showAlert?.({
        message: 'Translation settings saved',
        type: 'success',
        duration: 2000,
      });
      onTranslationSettingsClose?.();
    } catch (error) {
      console.error('Failed to save translation settings', error);
      showAlert?.({
        message: 'Failed to save translation settings',
        type: 'danger',
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const dimensions = {
    width: 460,
    height: speakerRows.length > 0 ? 720 : 620,
  };

  const defaultContainer = (
    <Modal
      visible={isTranslationSettingsModalVisible}
      transparent
      animationType="fade"
      onRequestClose={onTranslationSettingsClose}
    >
      <View style={[styles.modalOverlay, getModalPosition({ position })]}>
        <View
          style={[
            styles.container,
            backgroundColor ? { backgroundColor } : null,
            { borderColor: theme.borderColor },
            style,
          ]}
        >
          <View
            style={[styles.header, { borderBottomColor: theme.dividerColor }]}
          >
            <View style={styles.headerCopy}>
              <Text style={[styles.title, { color: theme.textColor }]}>Translation</Text>
              <Text style={[styles.subtitle, { color: theme.mutedTextColor }]}>Configure speaking, listening, and subtitle preferences.</Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onTranslationSettingsClose}
              style={[styles.closeButton, { borderColor: theme.borderColor }]}
            >
              <Text style={[styles.closeButtonText, { color: theme.textColor }]}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Tab navigation bar */}
          <View style={[styles.tabBar, { borderBottomColor: theme.dividerColor }]}>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setActiveTab('speaking')}
              style={[
                styles.tabBtn,
                { borderColor: theme.borderColor },
                activeTab === 'speaking'
                  ? { backgroundColor: theme.buttonBackgroundColor }
                  : { backgroundColor: theme.rowBackgroundColor },
              ]}
            >
              <Text style={[styles.tabBtnText, { color: activeTab === 'speaking' ? theme.buttonTextColor : theme.textColor }]}>
                My Voice Output
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => setActiveTab('listening')}
              style={[
                styles.tabBtn,
                { borderColor: theme.borderColor },
                activeTab === 'listening'
                  ? { backgroundColor: theme.buttonBackgroundColor }
                  : { backgroundColor: theme.rowBackgroundColor },
              ]}
            >
              <Text style={[styles.tabBtnText, { color: activeTab === 'listening' ? theme.buttonTextColor : theme.textColor }]}>
                Listen To
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Room status card — always visible in both tabs */}
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: theme.rowBackgroundColor,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Room status</Text>
              <Text style={[styles.bodyText, { color: theme.mutedTextColor }]}> 
                {translationConfig?.supportTranslation === false
                  ? 'Real-time translation is disabled for this room.'
                  : 'Real-time translation is available in this room.'}
              </Text>
            </View>

            {activeTab === 'speaking' ? (
              /* ── My Voice Output tab ── */
              <View
                style={[
                  styles.sectionCard,
                  {
                    backgroundColor: theme.rowBackgroundColor,
                    borderColor: theme.borderColor,
                  },
                ]}
              >
                <View style={styles.rowBetween}>
                  <View style={styles.switchCopy}>
                    <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Translate my audio</Text>
                    <Text style={[styles.bodyText, { color: theme.mutedTextColor }]}>Let listeners hear your speech in a translated output language.</Text>
                  </View>
                  <Switch
                    value={localSpokenEnabled}
                    onValueChange={setLocalSpokenEnabled}
                    trackColor={{ false: theme.borderColor, true: theme.accentColor }}
                    thumbColor={theme.buttonTextColor}
                  />
                </View>

                <Text style={[styles.fieldLabel, { color: theme.textColor }]}>Spoken language</Text>
                <RNPickerSelect
                  style={themedPickerSelectStyles}
                  value={localSpokenLanguage}
                  onValueChange={(value) => setLocalSpokenLanguage(value || 'en')}
                  items={spokenLanguageItems}
                  disabled={spokenChangeDisabled}
                  placeholder={{ label: 'Select spoken language', value: null }}
                  useNativeAndroidPickerStyle={false}
                />

                <Text style={[styles.fieldLabel, { color: theme.textColor }]}>Audience output language</Text>
                <RNPickerSelect
                  style={themedPickerSelectStyles}
                  value={localDefaultOutputLanguage}
                  onValueChange={(value) => setLocalDefaultOutputLanguage(value)}
                  items={listenLanguageItems}
                  disabled={!localSpokenEnabled}
                  placeholder={{ label: 'Same as spoken language', value: null }}
                  useNativeAndroidPickerStyle={false}
                />
              </View>
            ) : (
              /* ── Listen To tab ── */
              <>
                <View
                  style={[
                    styles.sectionCard,
                    {
                      backgroundColor: theme.rowBackgroundColor,
                      borderColor: theme.borderColor,
                    },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.switchCopy}>
                      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Per-speaker listening</Text>
                      <Text style={[styles.bodyText, { color: theme.mutedTextColor }]}>Choose one language for everyone, or override specific speakers.</Text>
                    </View>
                    <Switch
                      value={perSpeakerMode}
                      onValueChange={setPerSpeakerMode}
                      disabled={listenChangeDisabled}
                      trackColor={{ false: theme.borderColor, true: theme.accentColor }}
                      thumbColor={theme.buttonTextColor}
                    />
                  </View>

                  {!perSpeakerMode ? (
                    <>
                      <Text style={[styles.fieldLabel, { color: theme.textColor }]}>Listen to everyone in</Text>
                      <RNPickerSelect
                        style={themedPickerSelectStyles}
                        value={localDefaultListenLanguage}
                        onValueChange={(value) => setLocalDefaultListenLanguage(value)}
                        items={listenLanguageItems}
                        disabled={listenChangeDisabled}
                        placeholder={{ label: 'Original audio', value: null }}
                        useNativeAndroidPickerStyle={false}
                      />
                    </>
                  ) : (
                    <View style={styles.speakerList}>
                      {speakerRows.length === 0 ? (
                        <Text style={[styles.bodyText, { color: theme.mutedTextColor }]}>Speaker overrides appear once other participants join.</Text>
                      ) : (
                        speakerRows.map((participant) => {
                          const speakerId = resolveSpeakerId(participant);
                          const currentValue = localListenPreferences.get(speakerId) || null;

                          return (
                            <View
                              key={`${speakerId}_${participant.name}`}
                              style={[
                                styles.speakerRow,
                                {
                                  backgroundColor: theme.inputBackgroundColor,
                                  borderColor: theme.borderColor,
                                },
                              ]}
                            >
                              <View style={styles.speakerCopy}>
                                <Text style={[styles.speakerName, { color: theme.textColor }]}>
                                  {participant.name}
                                </Text>
                                <Text style={[styles.bodyText, { color: theme.mutedTextColor }]}> 
                                  {currentValue
                                    ? `Translate to ${getLanguageName(currentValue)}`
                                    : 'Original audio'}
                                </Text>
                              </View>
                              <View style={styles.speakerPicker}>
                                <RNPickerSelect
                                  style={themedPickerSelectStyles}
                                  value={currentValue}
                                  onValueChange={(value) =>
                                    handleSpeakerPreferenceChange(speakerId, value)
                                  }
                                  items={listenLanguageItems}
                                  disabled={listenChangeDisabled}
                                  placeholder={{ label: 'Original audio', value: null }}
                                  useNativeAndroidPickerStyle={false}
                                />
                              </View>
                            </View>
                          );
                        })
                      )}
                    </View>
                  )}
                </View>

                <View
                  style={[
                    styles.sectionCard,
                    {
                      backgroundColor: theme.rowBackgroundColor,
                      borderColor: theme.borderColor,
                    },
                  ]}
                >
                  <View style={styles.rowBetween}>
                    <View style={styles.switchCopy}>
                      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Live subtitles on cards</Text>
                      <Text style={[styles.bodyText, { color: theme.mutedTextColor }]}>Show the latest translated transcript directly on participant cards.</Text>
                    </View>
                    <Switch
                      value={localShowSubtitles}
                      onValueChange={setLocalShowSubtitles}
                      trackColor={{ false: theme.borderColor, true: theme.accentColor }}
                      thumbColor={theme.buttonTextColor}
                    />
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: theme.dividerColor }]}> 
            <TouchableOpacity
              accessibilityRole="button"
              onPress={onTranslationSettingsClose}
              style={[styles.secondaryButton, { borderColor: theme.borderColor }]}
            >
              <Text style={[styles.secondaryButtonText, { color: theme.textColor }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              disabled={!hasChanges || isSaving}
              onPress={handleSave}
              style={[
                styles.primaryButton,
                {
                  backgroundColor:
                    !hasChanges || isSaving
                      ? theme.borderColor
                      : theme.buttonBackgroundColor,
                },
              ]}
            >
              <Text style={[styles.primaryButtonText, { color: theme.buttonTextColor }]}> 
                {isSaving ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return renderContainer
    ? (renderContainer({ defaultContainer, dimensions }) as React.ReactElement)
    : defaultContainer;
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
  },
  container: {
    width: '92%',
    maxWidth: 460,
    maxHeight: '88%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  closeButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
  },
  sectionCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  switchCopy: {
    flex: 1,
    gap: 4,
  },
  speakerList: {
    gap: 10,
  },
  speakerRow: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  speakerCopy: {
    gap: 2,
  },
  speakerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  speakerPicker: {
    minWidth: 160,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

export default TranslationSettingsModal;