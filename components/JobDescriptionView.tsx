
import React from 'react';
import { JobDescription } from '../types';

interface Props {
  data: JobDescription;
}

const JobDescriptionView: React.FC<Props> = ({ data }) => {
  const copyToClipboard = () => {
    const text = `
${data.title} at ${data.companyName} (${data.location})

${data.summary}

Key Responsibilities:
${data.responsibilities.map(r => `• ${r}`).join('\n')}

What We're Looking For:
${data.qualifications.map(q => `• ${q}`).join('\n')}

Benefits:
${data.benefits.map(b => `• ${b}`).join('\n')}

${data.callToAction}
    `.trim();
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          LinkedIn Job Description
        </h3>
        <button 
          onClick={copyToClipboard}
          className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded text-sm transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy
        </button>
      </div>
      <div className="p-6 space-y-6 text-slate-700">
        <div>
          <h4 className="text-2xl font-bold text-slate-900">{data.title}</h4>
          <p className="text-slate-500 font-medium">{data.companyName} • {data.location}</p>
        </div>

        <section>
          <h5 className="font-bold text-slate-900 mb-2">Summary</h5>
          <p className="leading-relaxed whitespace-pre-line">{data.summary}</p>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 mb-2">Key Responsibilities</h5>
          <ul className="list-disc pl-5 space-y-1">
            {data.responsibilities.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>

        <section>
          <h5 className="font-bold text-slate-900 mb-2">What We're Looking For</h5>
          <ul className="list-disc pl-5 space-y-1">
            {data.qualifications.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </section>

        {data.benefits && data.benefits.length > 0 && (
          <section>
            <h5 className="font-bold text-slate-900 mb-2">Benefits</h5>
            <ul className="list-disc pl-5 space-y-1">
              {data.benefits.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="pt-4 border-t border-slate-100 italic text-slate-500">
          {data.callToAction}
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionView;
