import { List, MessageCircle, AlarmClock, Mail, Calendar } from 'lucide-react';

const actions = [
  { label: 'Make a note', icon: List, prompt: 'Create a note about meeting outcomes.' },
  { label: 'Send a message', icon: MessageCircle, prompt: 'Send a text to Alex: On my way!'},
  { label: 'Set reminder', icon: AlarmClock, prompt: 'Remind me at 6 pm to workout.'},
  { label: 'Check email', icon: Mail, prompt: 'Check for new emails.'},
  { label: 'Schedule', icon: Calendar, prompt: 'Create an event for coffee tomorrow 10am.'},
];

export default function QuickActions({ onSelect }) {
  return (
    <section className="max-w-md mx-auto px-4 mt-4">
      <h2 className="text-sm font-medium text-slate-700 mb-2">Quick actions</h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map(({ label, icon: Icon, prompt }) => (
          <button
            key={label}
            onClick={() => onSelect(prompt)}
            className="h-24 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow transition p-3 flex flex-col items-center justify-center text-center"
          >
            <Icon className="h-6 w-6 text-indigo-600 mb-2" />
            <span className="text-xs font-medium text-slate-800">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
