
import React from 'react';
import { InterviewQuestion } from '../types';

interface Props {
  questions: InterviewQuestion[];
}

const InterviewGuideView: React.FC<Props> = ({ questions }) => {
  const safeQuestions = questions || [];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Behavioral Interview Guide
        </h3>
      </div>
      <div className="p-6 space-y-8">
        {safeQuestions.length > 0 ? (
          safeQuestions.map((q, i) => (
            <div key={i} className="group relative pl-8 border-l-2 border-slate-100 hover:border-indigo-300 transition-colors">
              <div className="absolute -left-3 top-0 bg-indigo-50 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white">
                {i + 1}
              </div>
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-lg font-semibold text-slate-900 pr-4">{q.question}</h4>
                  <span className="bg-indigo-100 text-indigo-700 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded shrink-0">
                    {q.targetSkill || 'General'}
                  </span>
                </div>
                
                <div className="text-sm text-slate-600 italic">
                  <strong>Why ask this:</strong> {q.rationale || 'To assess capability.'}
                </div>

                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Look for indicators:</p>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {q.expectedIndicators?.map((ind, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-indigo-400 mt-1">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-400 italic">
            Chưa có câu hỏi phỏng vấn nào được tạo.
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewGuideView;
