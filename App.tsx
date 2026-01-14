
import React, { useState } from 'react';
import { recruitmentService } from './services/gemini';
import { RecruitmentData } from './types';
import JobDescriptionView from './components/JobDescriptionView';
import InterviewGuideView from './components/InterviewGuideView';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [data, setData] = useState<RecruitmentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!notes.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await recruitmentService.generateRecruitmentSandbox(notes);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.691.346a6 6 0 01-3.86.517l-2.388-.477a2 2 0 00-1.022.547l-1.168 1.168a2 2 0 00-.586 1.414v1a2 2 0 002 2h14a2 2 0 002-2v-1a2 2 0 00-.586-1.414l-1.168-1.168z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 16a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">RecruitSandbox AI</h1>
              <p className="text-xs text-slate-500 font-medium">Think Deep. Hire Better.</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <span className="text-sm font-medium text-slate-600 hover:text-indigo-600 cursor-pointer">Market Insights</span>
            <span className="text-sm font-medium text-slate-600 hover:text-indigo-600 cursor-pointer">Candidate Scorecards</span>
            <span className="text-sm font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">Sandbox Mode</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Raw Hiring Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="E.g. We need a Senior Frontend Dev for our fintech startup. Needs React, TS, d3. Soft skills: good communicator, loves teaching others. Remote, but must be in EST. Salary ~160k. 3 weeks PTO..."
                className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none resize-none"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading || !notes.trim()}
                className="w-full mt-4 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking Deeply...
                  </>
                ) : (
                  <>
                    Generate Sandbox
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
              <p className="mt-3 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
                Uses Gemini 3 Pro with Thinking Mode
              </p>
            </div>

            <div className="bg-indigo-900 rounded-xl p-6 text-white overflow-hidden relative">
              <div className="relative z-10">
                <h4 className="font-bold mb-2">Pro Tip</h4>
                <p className="text-sm text-indigo-100 opacity-90">
                  Include specific culture bits or "non-negotiables" in your notes. The AI will weave these into the JD to attract better cultural matches.
                </p>
              </div>
              <svg className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-800 opacity-50 rotate-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
              </svg>
            </div>
          </div>

          {/* Output Section */}
          <div className="lg:col-span-8 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {!data && !isLoading && !error && (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-center p-12">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">Sandbox is Empty</h3>
                <p className="max-w-md mx-auto">
                  Paste your raw role notes in the panel on the left to generate a recruitment strategy tailored for your needs.
                </p>
              </div>
            )}

            {isLoading && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-96 animate-pulse p-8">
                  <div className="h-8 bg-slate-100 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6 mb-8"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-100 rounded w-2/3 mb-2"></div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-96 animate-pulse p-8">
                  <div className="h-8 bg-slate-100 rounded w-1/4 mb-8"></div>
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 bg-slate-100 rounded-full"></div>
                        <div className="flex-1 h-12 bg-slate-100 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {data && !isLoading && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <JobDescriptionView data={data.jobDescription} />
                <InterviewGuideView questions={data.interviewGuide} />
              </div>
            )}
          </div>
        </div>
      </main>

      <ChatBot />

      {/* Footer Info */}
      <footer className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        <p>© 2024 RecruitSandbox AI. Powered by Google Gemini 3 Pro with 32k Thinking Budget.</p>
      </footer>
    </div>
  );
};

export default App;
