import React, { useState, useEffect, useCallback, useRef } from 'react';

// Fix: Add declarations for Web Speech API to the global Window interface.
// This resolves errors about SpeechRecognition and webkitSpeechRecognition not existing on `window`.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// Audio Effects
const useAudioEffects = () => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !audioCtxRef.current) {
       audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);
  
  const playSound = useCallback((type: 'applause' | 'error') => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    if (type === 'error') {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type='square'; o.frequency.setValueAtTime(320, audioCtx.currentTime);
        g.gain.setValueAtTime(0.001,audioCtx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.25, audioCtx.currentTime+0.02);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime+0.35);
        o.connect(g).connect(audioCtx.destination);
        o.start(); o.stop(audioCtx.currentTime+0.36);
    } else if (type === 'applause') {
        const dur = 0.8;
        const bufferSize = audioCtx.sampleRate * dur;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for(let i=0;i<bufferSize;i++){
            const t = i/bufferSize;
            const env = Math.pow(1 - t, 2);
            data[i] = (Math.random()*2-1) * env * 0.6;
        }
        const src = audioCtx.createBufferSource(); src.buffer=buffer;
        const filter = audioCtx.createBiquadFilter(); filter.type='bandpass'; filter.frequency.value=1800; filter.Q.value=0.7;
        const gain = audioCtx.createGain(); gain.gain.value=0.6;
        src.connect(filter).connect(gain).connect(audioCtx.destination);
        src.start();
    }
  }, []);

  return { playApplause: () => playSound('applause'), playBeepError: () => playSound('error') };
};


// Main Speech Hook
export const useSpeech = () => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isListening, setIsListening] = useState(false);
  // Fix: The `SpeechRecognition` constant shadows the global type. Using `any`
  // for the ref's type avoids this name collision and works with the dynamic API object.
  const recognizerRef = useRef<any | null>(null);
  const { playApplause, playBeepError } = useAudioEffects();

  const loadVoices = useCallback(() => {
    const allVoices = window.speechSynthesis.getVoices();
    setVoices(allVoices);
  }, []);

  useEffect(() => {
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [loadVoices]);

  const speak = useCallback((text: string, voiceName: string, rate: number) => {
    if (!('speechSynthesis' in window) || !text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate || 1.0;
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      utterance.voice = voice;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const startListening = useCallback((lang: string, onResult: (transcript: string) => void, onError: () => void) => {
    if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in this browser. Please use Google Chrome.");
        return;
    }
    if (isListening) return;

    const recognizer = new SpeechRecognition();
    recognizer.lang = lang;
    recognizer.interimResults = false;
    recognizer.maxAlternatives = 1;
    recognizerRef.current = recognizer;
    
    setIsListening(true);
    
    recognizer.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
    };
    
    recognizer.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        onError();
        setIsListening(false);
    };

    recognizer.onend = () => {
        setIsListening(false);
        recognizerRef.current = null;
    };
    
    recognizer.start();
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
        recognizerRef.current.abort();
    }
    setIsListening(false);
  }, []);

  return {
    voices,
    isListening,
    speak,
    startListening,
    stopListening,
    playApplause,
    playBeepError
  };
};