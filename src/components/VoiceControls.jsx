import { Mic, Square, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function VoiceControls({ onTranscript, onCommand, speaking, setSpeaking }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const supportsSTT = typeof window !== 'undefined' && (
    'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
  );

  useEffect(() => {
    if (!supportsSTT) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          onTranscript(transcript.trim());
          onCommand(transcript.trim());
          setListening(false);
        } else {
          interimTranscript += transcript;
          onTranscript(interimTranscript.trim());
        }
      }
    };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [supportsSTT, onTranscript, onCommand]);

  const handleStart = () => {
    if (!supportsSTT) return alert('Speech recognition not supported on this device/browser.');
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const handleStop = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
  };

  const speakSample = () => {
    const utter = new SpeechSynthesisUtterance('Hello, I am ready. How can I help you?');
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={listening ? handleStop : handleStart}
            className={`flex-1 h-12 rounded-2xl font-semibold text-white shadow-lg transition active:scale-95 grid place-items-center ${
              listening
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
            aria-label={listening ? 'Stop listening' : 'Start listening'}
          >
            <div className="flex items-center gap-2">
              {listening ? (
                <Square className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
              <span>{listening ? 'Stop' : 'Speak'}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setSpeaking((s) => !s);
              if (!speaking) speakSample();
            }}
            className={`h-12 w-12 rounded-2xl border grid place-items-center transition ${
              speaking ? 'border-indigo-600 text-indigo-600' : 'border-slate-300 text-slate-700'
            }`}
            aria-label="Toggle voice responses"
            title="Toggle voice responses"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>
        {!supportsSTT && (
          <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
            Your browser does not support speech recognition. You can still type to interact.
          </p>
        )}
      </div>
    </div>
  );
}
