import React, { useEffect, useRef, useState } from 'react';
import {
  Modal, Platform, Pressable, StyleSheet, Text, View, useColorScheme,
} from 'react-native';
import type { ScreenAudioChoice } from '../../consumers/screenAudio';

export interface ScreenAudioPromptOptions {
  /** Called once with the user's answer: `audio`, `video` (screen only) or `null` (cancelled). */
  onChoose: (choice: ScreenAudioChoice) => void;
  /** Show or hide the dialog (default true). */
  isVisible?: boolean;
  /** Dark styling (default: follows the system colour scheme). */
  isDarkMode?: boolean;
  title?: string;
  message?: string;
  shareWithAudioLabel?: string;
  shareWithAudioHint?: string;
  shareScreenOnlyLabel?: string;
  shareScreenOnlyHint?: string;
  cancelLabel?: string;
  /** Small note under the choices (e.g. where the browser's own audio switch is). */
  footnote?: string;
  /** Badge on the audio choice; empty string hides it. */
  recommendedLabel?: string;
}

export type ScreenAudioPromptType = (options: ScreenAudioPromptOptions) => JSX.Element;

// Slate surfaces and a teal accent (the Modern UI's neutral palette).
const palette = (dark: boolean) => (dark
  ? {
    scrim: 'rgba(2, 6, 23, 0.62)', panel: 'rgba(15, 23, 42, 0.96)', border: 'rgba(148, 163, 184, 0.18)',
    text: '#f1f5f9', muted: '#94a3b8', tile: 'rgba(30, 41, 59, 0.85)', tileBorder: 'rgba(148, 163, 184, 0.16)',
    accent: '#2dd4bf', accentSoft: 'rgba(45, 212, 191, 0.14)', accentLine: 'rgba(45, 212, 191, 0.55)',
    onAccent: '#042f2e',
  }
  : {
    scrim: 'rgba(15, 23, 42, 0.38)', panel: '#ffffff', border: 'rgba(15, 23, 42, 0.08)',
    text: '#0f172a', muted: '#64748b', tile: '#f8fafc', tileBorder: 'rgba(15, 23, 42, 0.08)',
    accent: '#0d9488', accentSoft: 'rgba(13, 148, 136, 0.09)', accentLine: 'rgba(13, 148, 136, 0.5)',
    onAccent: '#ffffff',
  });

/**
 * Asks whether a screen share should include the audio of the shared tab or screen. The browser's own picker opens
 * after the choice, so the user still decides what to share there. Shown on web builds in browsers that can capture
 * display audio, and on Android/iOS only for an app-supplied capture that supports audio (`uiOverrides.screenCapture`).
 *
 * @example
 * ```tsx
 * <ScreenAudioPrompt onChoose={(choice) => console.log(choice)} />
 * ```
 */
const ScreenAudioPrompt: React.FC<ScreenAudioPromptOptions> = ({
  onChoose,
  isVisible = true,
  isDarkMode,
  title = 'Share audio too?',
  message = 'Include the sound from what you share, such as a video or music.',
  shareWithAudioLabel = 'Screen + audio',
  shareWithAudioHint = 'Everyone hears the tab or screen you share',
  shareScreenOnlyLabel = 'Screen only',
  shareScreenOnlyHint = 'Share the picture without its sound',
  cancelLabel = 'Cancel',
  footnote = 'Your browser asks what to share next. For a tab, keep “Share tab audio” on.',
  recommendedLabel = 'Recommended',
}) => {
  const scheme = useColorScheme();
  const c = palette(isDarkMode ?? scheme === 'dark');
  const primaryRef = useRef<any>(null);

  // Keyboard users land on the primary choice (React Native Web renders a focusable element).
  useEffect(() => {
    if (isVisible && Platform.OS === 'web') {
      const id = setTimeout(() => primaryRef.current?.focus?.(), 0);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [isVisible]);

  const tile = (featured: boolean, pressed: boolean) => [
    styles.tile,
    {
      backgroundColor: featured || pressed ? c.accentSoft : c.tile,
      borderColor: featured ? c.accentLine : c.tileBorder,
    },
  ];

  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={() => onChoose(null)}
    >
      <View style={styles.root} testID="screen-audio-prompt">
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: c.scrim }]}
          onPress={() => onChoose(null)}
          accessibilityLabel={cancelLabel}
        />
        <View
          accessibilityRole={Platform.OS === 'web' ? undefined : 'alert'}
          accessibilityViewIsModal
          style={[styles.panel, { backgroundColor: c.panel, borderColor: c.border }]}
        >
          <Text style={[styles.title, { color: c.text }]}>{title}</Text>
          <Text style={[styles.message, { color: c.muted }]}>{message}</Text>

          <Pressable
            ref={primaryRef}
            testID="screen-audio-prompt-audio"
            accessibilityRole="button"
            accessibilityLabel={`${shareWithAudioLabel}. ${shareWithAudioHint}`}
            onPress={() => onChoose('audio')}
            style={({ pressed }) => tile(true, pressed)}
          >
            <View style={styles.tileHeader}>
              <Text style={[styles.tileLabel, { color: c.text }]}>{shareWithAudioLabel}</Text>
              {recommendedLabel ? (
                <Text style={[styles.badge, { backgroundColor: c.accent, color: c.onAccent }]}>{recommendedLabel}</Text>
              ) : null}
            </View>
            <Text style={[styles.tileHint, { color: c.muted }]}>{shareWithAudioHint}</Text>
          </Pressable>

          <Pressable
            testID="screen-audio-prompt-video"
            accessibilityRole="button"
            accessibilityLabel={`${shareScreenOnlyLabel}. ${shareScreenOnlyHint}`}
            onPress={() => onChoose('video')}
            style={({ pressed }) => tile(false, pressed)}
          >
            <Text style={[styles.tileLabel, { color: c.text }]}>{shareScreenOnlyLabel}</Text>
            <Text style={[styles.tileHint, { color: c.muted }]}>{shareScreenOnlyHint}</Text>
          </Pressable>

          {footnote ? <Text style={[styles.footnote, { color: c.muted }]}>{footnote}</Text> : null}

          <Pressable
            testID="screen-audio-prompt-cancel"
            accessibilityRole="button"
            onPress={() => onChoose(null)}
            style={styles.cancel}
          >
            <Text style={[styles.cancelText, { color: c.muted }]}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

interface PromptRequest {
  options: Omit<ScreenAudioPromptOptions, 'onChoose' | 'isVisible'>;
  resolve: (choice: ScreenAudioChoice) => void;
}

// Mounted hosts, newest last; the newest one shows the dialog.
const hosts: ((request: PromptRequest) => void)[] = [];

export type PromptScreenAudioChoiceOptions = Omit<ScreenAudioPromptOptions, 'onChoose' | 'isVisible'>;

/**
 * Shows the screen-audio choice in the mounted `ScreenAudioPromptHost` and resolves with the answer. Without a host it
 * resolves `audio`, so the browser picker's own "share audio" switch decides.
 */
export const promptScreenAudioChoice = (options: PromptScreenAudioChoiceOptions = {}): Promise<ScreenAudioChoice> =>
  new Promise((resolve) => {
    const host = hosts[hosts.length - 1];
    if (!host) {
      resolve('audio');
      return;
    }
    host({ options, resolve });
  });

export interface ScreenAudioPromptHostOptions extends Omit<ScreenAudioPromptOptions, 'onChoose' | 'isVisible'> {
  /** Replace the default dialog (same contract). */
  promptComponent?: React.ComponentType<ScreenAudioPromptOptions>;
}

/**
 * Renders the screen-audio dialog when `promptScreenAudioChoice` asks. The MediaSFU room components mount one; it
 * renders nothing until asked.
 */
export const ScreenAudioPromptHost: React.FC<ScreenAudioPromptHostOptions> = ({ promptComponent, ...defaults }) => {
  const [request, setRequest] = useState<PromptRequest | null>(null);
  const requestRef = useRef<PromptRequest | null>(null);

  useEffect(() => {
    const show = (next: PromptRequest) => {
      requestRef.current?.resolve(null);
      requestRef.current = next;
      setRequest(next);
    };
    hosts.push(show);
    return () => {
      const index = hosts.indexOf(show);
      if (index >= 0) {hosts.splice(index, 1);}
      requestRef.current?.resolve(null);
      requestRef.current = null;
    };
  }, []);

  if (!request) {return null;}
  const Prompt = promptComponent ?? ScreenAudioPrompt;
  const choose = (choice: ScreenAudioChoice) => {
    if (requestRef.current !== request) {return;}
    requestRef.current = null;
    setRequest(null);
    request.resolve(choice);
  };
  return <Prompt {...defaults} {...request.options} isVisible onChoose={choose} />;
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  panel: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  tile: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  tileLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  tileHint: {
    fontSize: 13,
    marginTop: 2,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  footnote: {
    fontSize: 12,
    lineHeight: 17,
  },
  cancel: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ScreenAudioPrompt;
