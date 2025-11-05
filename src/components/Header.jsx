import { Settings, Zap } from 'lucide-react';

export default function Header({ onOpenSettings }) {
  return (
    <header className="w-full sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-slate-200">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-rose-500 grid place-items-center text-white shadow">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900 leading-tight">Nova Voice</h1>
            <p className="text-xs text-slate-500">Your on-the-go AI assistant</p>
          </div>
        </div>
        <button
          aria-label="Open settings"
          onClick={onOpenSettings}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 active:scale-95 transition"
        >
          <Settings className="h-5 w-5 text-slate-700" />
        </button>
      </div>
    </header>
  );
}
