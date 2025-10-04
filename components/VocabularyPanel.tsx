
import React, { useState, useEffect, useCallback } from 'react';
import { DATA } from '../constants';
import { score10 } from '../utils/helpers';
import type { Unit, ToastState } from '../types';
import { useSpeech } from '../hooks/useSpeech';
import { IconButton, ScoreBar, Toast, Chip } from './common';

interface VocabularyPanelProps {
  unit: Unit;
  voiceName: string;
  rate: number;
}

const SpeakerIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 9v6h4l5 4V5L9 9H5z" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <path d="M16.5 8.5a4 4 0 010 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
);

const MicIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="9" y="3" width="6" height="10" rx="3" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M5 11a7 7 0 0014 0M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
);

const PrevIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
);

const NextIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
);


export const VocabularyPanel: React.FC<VocabularyPanelProps> = ({ unit, voiceName, rate }) => {
  const [vIndex, setVIndex] = useState(0);
  const [heardWord, setHeardWord] = useState('—');
  const [score, setScore] = useState(0);
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'ok', visible: false });
  const { isListening, speak, startListening, stopListening, playApplause, playBeepError } = useSpeech();

  const currentWord = unit.vocab[vIndex];

  useEffect(() => {
    setVIndex(0);
    setHeardWord('—');
    setScore(0);
    setToast(t => ({...t, visible: false}));
  }, [unit]);

  const showToast = useCallback((message: string, type: ToastState['type']) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(t => ({...t, visible: false})), 3500);
  }, []);
  
  const handleScore = useCallback((s: number) => {
    setScore(s);
    if (s >= 9) {
      playApplause();
      speak('Excellent!');
      showToast('👏 Excellent! Very good pronunciation.', 'ok');
    } else if (s >= 7) {
      showToast('👍 Good job! Keep practicing.', 'ok');
    } else if (s >= 5) {
      playBeepError();
      showToast('🟠 You can do it better. Try to speak more clearly.', 'warn');
    } else {
      playBeepError();
      showToast('❌ Not quite right. Listen to the sample and try again.', 'bad');
    }
  }, [playApplause, playBeepError, showToast, speak]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      setHeardWord('(listening...)');
      startListening(
        'en-US',
        (transcript) => {
          setHeardWord(transcript);
          const newScore = score10(currentWord, transcript);
          handleScore(newScore);
        },
        () => {
          setHeardWord('—');
          showToast('Could not hear you. Please try again.', 'bad');
        }
      );
    }
  };
  
  const navigateWord = (delta: number) => {
    const total = unit.vocab.length;
    setVIndex((prev) => (prev + delta + total) % total);
    setHeardWord('—');
    setScore(0);
    setToast(t => ({...t, visible: false}));
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <div className="text-sm text-slate-500">Current Unit • Word {vIndex + 1}/{unit.vocab.length}</div>
          <div className="text-4xl md:text-5xl font-extrabold text-slate-800 my-2 tracking-wide" aria-live="polite">{currentWord}</div>
          <div className="flex flex-wrap gap-2">
            {unit.topicChips.map(chip => <Chip key={chip}>{chip}</Chip>)}
          </div>
        </div>
        <div className="flex gap-2.5 self-start sm:self-center">
            <IconButton aria-label="Listen to pronunciation" onClick={() => speak(currentWord, voiceName, rate)}>
                <SpeakerIcon />
            </IconButton>
            <IconButton aria-label="Record your voice" onClick={handleMicClick} isPressed={isListening}>
                <MicIcon />
            </IconButton>
            <IconButton aria-label="Previous word" onClick={() => navigateWord(-1)}>
                <PrevIcon />
            </IconButton>
            <IconButton aria-label="Next word" variant="next" onClick={() => navigateWord(1)}>
                <NextIcon />
            </IconButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-slate-500 mb-1">You said:</div>
            <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-3 text-slate-700 min-h-[44px]" aria-live="polite">{heardWord}</div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm text-slate-500">Pronunciation Score</div>
              <div className="font-bold text-slate-800">{score}/10</div>
            </div>
            <ScoreBar score={score} />
          </div>
      </div>
      <Toast toast={toast} />
    </section>
  );
};
