
"use client";

import React, { createContext, useState, useContext, useMemo } from 'react';

export type Mood = "joyful" | "happy" | "neutral" | "sad" | "annoyed" | "default";

interface MoodContextType {
  mood: Mood;
  setMood: (mood: Mood) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [mood, setMood] = useState<Mood>("default");

  const value = useMemo(() => ({ mood, setMood }), [mood]);

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};
