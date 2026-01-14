
import React, { useState, useRef, useEffect } from 'react';
import { recruitmentService } from '../services/gemini';
import { ChatMessage } from '../types';

interface Props {
  currentNotes: string;
  onApplyRevisedNotes: (newNotes: string) => void;
}

const ChatBot: React.FC<Props> = ({ currentNotes, onApplyRevisedNotes }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const extractRevisedPrompt = (text: string): { cleanText: string; prompt: string | null } => {
    const regex = /\[REVISED_PROMPT\]([\s\S]*?)\[\/REVISED_PROMPT\]/;
    const match = text.match(regex);
    if (match) {
      const prompt = match[1].trim();
      const cleanText = text.replace(regex, '').trim();
      return { cleanText, prompt };
    }
    return { cleanText: text, prompt: null };
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setPendingPrompt(null);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const stream = recruitmentService.streamChat(inputValue, currentNotes, history);
      let assistantText = '';
      
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        assistantText += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = assistantText;
          return newMessages;
        });
      }

      const { cleanText, prompt } = extractRevisedPrompt(assistantText);
      if (prompt) {
        setPendingPrompt(prompt);
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = cleanText;
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Tôi xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = () => {
    if (pendingPrompt) {
      onApplyRevisedNotes(pendingPrompt);
      setPendingPrompt(null);
      setIsOpen(false); // Close chat to show the sandbox update
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all transform hover:scale-105 z-50 ${isOpen ? 'bg-slate-800' : 'bg-indigo-600'}`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[600px] h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 z-50 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-medium text-sm">RecruitAI Assistant</span>
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
          >
            {messages.length === 0 && (
              <div className="text-center py-10 px-6 text-slate-400 text-sm">
                Chào bạn! Tôi có thể giúp bạn tinh chỉnh ghi chú tuyển dụng. Bạn muốn thêm yêu cầu hay thay đổi gì không?
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-2xl text-sm shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {m.text || (
                      <div className="flex gap-1 py-1">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {pendingPrompt && (
              <div className="flex justify-start animate-in fade-in zoom-in duration-300">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 w-[90%] space-y-3">
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Đề xuất ghi chú mới</p>
                  <p className="text-xs text-slate-500 line-clamp-3 italic">"{pendingPrompt}"</p>
                  <button 
                    onClick={handleApplyAction}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Cập nhật & Tạo lại Sandbox
                  </button>
                </div>
              </div>
            )}
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Yêu cầu sửa đổi ghi chú..."
              className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-50 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
