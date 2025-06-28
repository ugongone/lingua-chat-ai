'use client';

import { Button } from '@repo/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MicButtonProps {
  isListening?: boolean;
  isSupported?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function MicButton({ 
  isListening = false, 
  isSupported = true, 
  onClick, 
  disabled = false,
  className 
}: MicButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={!isSupported || disabled}
      variant={isListening ? "destructive" : "default"}
      size="lg"
      className={cn(
        "rounded-full w-16 h-16 p-0 transition-all duration-200",
        isListening && "animate-pulse bg-red-500 hover:bg-red-600",
        !isSupported && "opacity-50 cursor-not-allowed",
        className
      )}
      title={
        !isSupported 
          ? "音声入力がサポートされていません" 
          : isListening 
          ? "音声入力中... クリックで停止" 
          : "音声入力を開始"
      }
    >
      {isListening ? (
        <MicOff className="h-6 w-6" />
      ) : (
        <Mic className="h-6 w-6" />
      )}
    </Button>
  );
}

interface SpeakerButtonProps {
  isSpeaking?: boolean;
  isSupported?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function SpeakerButton({ 
  isSpeaking = false, 
  isSupported = true, 
  onClick, 
  disabled = false,
  className 
}: SpeakerButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={!isSupported || disabled}
      variant="outline"
      size="sm"
      className={cn(
        "transition-all duration-200",
        isSpeaking && "bg-blue-50 border-blue-300",
        !isSupported && "opacity-50 cursor-not-allowed",
        className
      )}
      title={
        !isSupported 
          ? "音声出力がサポートされていません" 
          : isSpeaking 
          ? "音声出力中... クリックで停止" 
          : "音声で読み上げ"
      }
    >
      <Volume2 className={cn("h-4 w-4", isSpeaking && "animate-pulse")} />
    </Button>
  );
}