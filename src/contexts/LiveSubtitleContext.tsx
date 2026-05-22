import React, { createContext, useContext, useMemo } from 'react';
import {
  getSubtitleForSpeaker as resolveSubtitleForSpeaker,
  type LiveSubtitle,
} from 'mediasfu-shared';

export interface LiveSubtitleContextValue {
  liveSubtitles: Map<string, LiveSubtitle>;
  showSubtitlesOnCards: boolean;
  getSubtitleForSpeaker: (speakerId: string, speakerName: string) => LiveSubtitle | null;
}

const LiveSubtitleContext = createContext<LiveSubtitleContextValue | null>(null);

export interface LiveSubtitleProviderProps {
  liveSubtitles: Map<string, LiveSubtitle>;
  showSubtitlesOnCards: boolean;
  children: React.ReactNode;
}

export const LiveSubtitleProvider: React.FC<LiveSubtitleProviderProps> = ({
  liveSubtitles,
  showSubtitlesOnCards,
  children,
}) => {
  const getSubtitleForSpeaker = useMemo(() => {
    return (speakerId: string, speakerName: string): LiveSubtitle | null => {
      return resolveSubtitleForSpeaker(liveSubtitles, speakerId, speakerName) || null;
    };
  }, [liveSubtitles]);

  const value = useMemo<LiveSubtitleContextValue>(() => ({
    liveSubtitles,
    showSubtitlesOnCards,
    getSubtitleForSpeaker,
  }), [liveSubtitles, showSubtitlesOnCards, getSubtitleForSpeaker]);

  return (
    <LiveSubtitleContext.Provider value={value}>
      {children}
    </LiveSubtitleContext.Provider>
  );
};

export const useLiveSubtitles = (): LiveSubtitleContextValue | null => {
  return useContext(LiveSubtitleContext);
};

export const useSpeakerSubtitle = (speakerId: string, speakerName: string): LiveSubtitle | null => {
  const context = useContext(LiveSubtitleContext);
  if (!context) return null;
  return context.getSubtitleForSpeaker(speakerId, speakerName);
};

export const useShowSubtitles = (): boolean => {
  const context = useContext(LiveSubtitleContext);
  return context?.showSubtitlesOnCards ?? false;
};

export default LiveSubtitleContext;