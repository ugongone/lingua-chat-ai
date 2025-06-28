'use client';

import { useEffect, useState } from 'react';
import { MicButton, SpeakerButton } from '@/components/mic-button';
import { useSpeechRecognition, useSpeechSynthesis } from '@/hooks/useSpeech';

export default function Home() {
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  
  const {
    isListening,
    transcript,
    isSupported: speechRecognitionSupported,
    startListening,
    stopListening,
    initialize: initializeSpeechRecognition,
  } = useSpeechRecognition();

  const {
    isSpeaking,
    isSupported: speechSynthesisSupported,
    speak,
    stop: stopSpeaking,
    initialize: initializeSpeechSynthesis,
  } = useSpeechSynthesis();

  useEffect(() => {
    initializeSpeechRecognition();
    initializeSpeechSynthesis();
  }, [initializeSpeechRecognition, initializeSpeechSynthesis]);

  useEffect(() => {
    if (transcript && !isListening) {
      setChatHistory(prev => [...prev, { role: 'user', content: transcript }]);
      
      const mockResponse = `I heard you say: "${transcript}". This is a mock response for testing.`;
      setChatHistory(prev => [...prev, { role: 'assistant', content: mockResponse }]);
      speak(mockResponse);
    }
  }, [transcript, isListening, speak]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakClick = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lingua Chat AI</h1>
          <p className="text-gray-600">音声で英会話を練習しよう</p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col items-center space-y-4">
            <MicButton
              isListening={isListening}
              isSupported={speechRecognitionSupported}
              onClick={handleMicClick}
            />
            
            {transcript && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">音声入力:</p>
                <p className="text-lg font-medium">{transcript}</p>
              </div>
            )}

            {!speechRecognitionSupported && (
              <p className="text-red-500 text-sm text-center">
                お使いのブラウザは音声入力をサポートしていません
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">会話履歴</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {chatHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                マイクボタンを押して話しかけてみてください
              </p>
            ) : (
              chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-sm px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p>{msg.content}</p>
                      {msg.role === 'assistant' && speechSynthesisSupported && (
                        <SpeakerButton
                          isSpeaking={isSpeaking}
                          isSupported={speechSynthesisSupported}
                          onClick={() => handleSpeakClick(msg.content)}
                          className="ml-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
