'use client';

import { useCallback, useRef, useState } from 'react';
import { SpeechRecognitionService, SpeechSynthesisService } from '@/lib/speech';

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const serviceRef = useRef<SpeechRecognitionService | null>(null);

  const initialize = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    serviceRef.current = new SpeechRecognitionService({
      lang: 'en-US',
      continuous: false,
      interimResults: true,
    });
    
    setIsSupported(serviceRef.current.isSupported);
  }, []);

  const startListening = useCallback(() => {
    if (!serviceRef.current?.isSupported) {
      initialize();
    }
    
    if (!serviceRef.current?.isSupported) return;

    setTranscript('');
    setIsListening(true);

    serviceRef.current.startListening(
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          setIsListening(false);
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      }
    );
  }, [initialize]);

  const stopListening = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stopListening();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    initialize,
  };
}

export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const serviceRef = useRef<SpeechSynthesisService | null>(null);

  const initialize = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    serviceRef.current = new SpeechSynthesisService({
      lang: 'en-US',
      rate: 1,
      pitch: 1,
      volume: 1,
    });
    
    setIsSupported(serviceRef.current.isSupported);
  }, []);

  const speak = useCallback((text: string) => {
    if (!serviceRef.current?.isSupported) {
      initialize();
    }
    
    if (!serviceRef.current?.isSupported || !text) return;

    setIsSpeaking(true);

    serviceRef.current.speak(
      text,
      () => setIsSpeaking(false),
      (error) => {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      }
    );
  }, [initialize]);

  const stop = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    stop,
    initialize,
  };
}