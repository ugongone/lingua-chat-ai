export interface SpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export interface SpeechSynthesisOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor(private options: SpeechRecognitionOptions = {}) {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.lang = this.options.lang || 'en-US';
    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = this.options.interimResults || true;
  }

  startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError?: (error: SpeechRecognitionErrorEvent) => void
  ) {
    if (!this.recognition || this.isListening) return;

    this.recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      const isFinal = event.results[event.results.length - 1].isFinal;
      onResult(transcript, isFinal);
    };

    this.recognition.onerror = (event) => {
      onError?.(event);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
    this.isListening = true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  get isSupported() {
    return this.recognition !== null;
  }

  get listening() {
    return this.isListening;
  }
}

export class SpeechSynthesisService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor(private options: SpeechSynthesisOptions = {}) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
    }
  }

  private loadVoices() {
    if (!this.synth) return;

    const updateVoices = () => {
      this.voices = this.synth!.getVoices();
    };

    updateVoices();
    this.synth.onvoiceschanged = updateVoices;
  }

  speak(text: string, onEnd?: () => void, onError?: (error: SpeechSynthesisErrorEvent) => void) {
    if (!this.synth) return;

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.options.lang || 'en-US';
    utterance.rate = this.options.rate || 1;
    utterance.pitch = this.options.pitch || 1;
    utterance.volume = this.options.volume || 1;

    const preferredVoice = this.voices.find(voice => 
      voice.lang.startsWith(utterance.lang.split('-')[0])
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => onEnd?.();
    utterance.onerror = (event) => onError?.(event);

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  get isSupported() {
    return this.synth !== null;
  }

  get isSpeaking() {
    return this.synth ? this.synth.speaking : false;
  }

  getVoices() {
    return this.voices;
  }
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}