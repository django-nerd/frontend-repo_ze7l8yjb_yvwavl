import { useEffect, useRef } from 'react';

export default function ResponsePanel({ messages }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <section className="max-w-md mx-auto px-4 mt-4 mb-32">
      <div ref={ref} className="h-[52vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3">
        {messages.length === 0 ? (
          <div className="h-full grid place-items-center text-center text-slate-500">
            <div>
              <p className="text-sm">Ask anything — try "Plan a 3-day trip to Tokyo"</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
