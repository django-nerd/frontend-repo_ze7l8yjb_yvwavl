import { useCallback, useMemo, useState } from 'react';
import Header from './components/Header';
import VoiceControls from './components/VoiceControls';
import QuickActions from './components/QuickActions';
import ResponsePanel from './components/ResponsePanel';

function synthSpeak(text) {
  if (typeof window === 'undefined') return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [speaking, setSpeaking] = useState(true);

  const addMessage = useCallback((role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  }, []);

  const handleCommand = useCallback(
    (text) => {
      const query = (text || draft).trim();
      if (!query) return;
      addMessage('user', query);

      // Simple intent routing (on-device)
      const lower = query.toLowerCase();
      let response = '';
      if (lower.includes('remind') || lower.includes('reminder')) {
        response = 'Okay, setting a reminder. I will alert you at the specified time.';
      } else if (lower.includes('message') || lower.includes('text')) {
        response = 'Sure, drafting your message. Would you like to send it now?';
      } else if (lower.includes('note')) {
        response = 'Added that to your notes.';
      } else if (lower.includes('email')) {
        response = 'Checking your inbox. You have a few new messages.';
      } else if (lower.includes('schedule') || lower.includes('event') || lower.includes('calendar')) {
        response = 'Creating the event in your calendar.';
      } else if (lower.startsWith('play') || lower.includes('music')) {
        response = 'Playing your requested track.';
      } else if (lower.includes('weather')) {
        response = 'Today is sunny with a high of 25 degrees.';
      } else {
        response = "Here's what I found: " + query;
      }

      addMessage('assistant', response);
      if (speaking) synthSpeak(response);
      setDraft('');
    },
    [addMessage, draft, speaking]
  );

  const handleTranscript = useCallback((interim) => {
    setDraft(interim);
  }, []);

  const onQuickSelect = useCallback((prompt) => {
    setDraft(prompt);
    handleCommand(prompt);
  }, [handleCommand]);

  const showWelcome = useMemo(() => messages.length === 0, [messages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
      <Header onOpenSettings={() => alert('Settings coming soon')} />

      {showWelcome && (
        <section className="max-w-md mx-auto px-4 pt-6">
          <div className="rounded-3xl p-5 bg-white border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-1">Hey! I’m Nova</h2>
            <p className="text-sm text-slate-600">
              Talk naturally and I’ll help with notes, reminders, messages, and more.
            </p>
          </div>
        </section>
      )}

      <QuickActions onSelect={onQuickSelect} />

      <ResponsePanel messages={messages} />

      <section className="max-w-md mx-auto px-4 mb-32">
        <div className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommand();
            }}
            placeholder="Type your request..."
            className="flex-1 h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleCommand()}
            className="h-12 px-4 rounded-2xl bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 active:scale-95 transition"
          >
            Send
          </button>
        </div>
      </section>

      <VoiceControls
        onTranscript={handleTranscript}
        onCommand={handleCommand}
        speaking={speaking}
        setSpeaking={setSpeaking}
      />
    </div>
  );
}
