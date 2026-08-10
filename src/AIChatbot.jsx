import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Bot, Minimize2, Maximize2, AlertTriangle } from 'lucide-react';

// Design tokens matching the V-Lab premium aesthetic
const C = {
  primary: '#d97706', // amber-600
  primaryHover: '#b45309', // amber-700
  secondary: '#0f766e', // teal-700
  bgDark: '#111827', // gray-900
  bgCard: '#1f2937', // gray-800
  bgLighter: '#374151', // gray-700
  text: '#f9fafb', // gray-50
  textMuted: '#9ca3af', // gray-400
  danger: '#ef4444' // red-500
};

export default function AIChatbot({ currentExperiment }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const initialGreeting = "Hello! I am Professor V-Lab, your electrical engineering tutor. " + 
    (currentExperiment ? `I see you are working on the ${currentExperiment} experiment. ` : "") + 
    "How can I help you with your circuits or engineering concepts today?";

  const [messages, setMessages] = useState([
    { role: 'assistant', content: initialGreeting }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const callAI = async (userText) => {
    setLoading(true);
    setError('');
    
    try {
      const contents = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      contents.push({ role: 'user', content: userText });

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: contents,
          currentExperiment
        })
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "API Error");
        }

        if (data.choices && data.choices.length > 0) {
          const reply = data.choices[0].message.content;
          setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } else {
          throw new Error("No response generated.");
        }
      } else {
        throw new Error("Backend not running. If testing locally, run 'npx vercel dev' instead of Vite.");
      }
      
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to AI Examiner.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    await callAI(userMessage);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: C.primary,
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 25px rgba(217, 119, 6, 0.4)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        title="Viva Examiner AI"
      >
        <MessageSquare size={28} />
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: isMinimized ? '24px' : '24px',
      right: '24px',
      width: '380px',
      height: isMinimized ? '60px' : '600px',
      maxHeight: '80vh',
      background: C.bgDark,
      borderRadius: '16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      overflow: 'hidden',
      border: `1px solid ${C.bgLighter}`,
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        background: C.bgCard,
        borderBottom: `1px solid ${C.bgLighter}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer'
      }} onClick={() => setIsMinimized(!isMinimized)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(217, 119, 6, 0.2)',
            color: C.primary,
            padding: '8px',
            borderRadius: '8px'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: C.text, fontSize: '16px', fontWeight: 600 }}>Professor V-Lab</h3>
            <p style={{ margin: 0, color: C.textMuted, fontSize: '12px' }}>Engineering Tutor AI</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
            style={{ background: 'transparent', border: 'none', color: C.textMuted, cursor: 'pointer', padding: '4px' }}
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            style={{ background: 'transparent', border: 'none', color: C.textMuted, cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
            {/* Chat Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    gap: '12px',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: msg.role === 'user' ? C.secondary : C.bgLighter,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div style={{
                      background: msg.role === 'user' ? C.secondary : C.bgCard,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      borderTopRightRadius: msg.role === 'user' ? '4px' : '12px',
                      borderTopLeftRadius: msg.role === 'assistant' ? '4px' : '12px',
                      color: C.text,
                      fontSize: '14px',
                      lineHeight: '1.5',
                      maxWidth: '85%'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: C.bgLighter,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <Bot size={16} />
                    </div>
                    <div style={{
                      background: C.bgCard,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      borderTopLeftRadius: '4px',
                      color: C.textMuted,
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <div className="dot-pulse"></div>
                      <span style={{ fontStyle: 'italic', marginLeft: '8px' }}>Examining your response...</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${C.danger}`,
                    color: C.danger,
                    padding: '12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <AlertTriangle size={16} flexShrink={0} />
                    {error}
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form onSubmit={handleSubmit} style={{
                padding: '16px',
                background: C.bgCard,
                borderTop: `1px solid ${C.bgLighter}`,
                display: 'flex',
                gap: '12px'
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your answer..."
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: C.bgDark,
                    border: `1px solid ${C.bgLighter}`,
                    borderRadius: '24px',
                    padding: '12px 16px',
                    color: C.text,
                    outline: 'none',
                    fontSize: '14px',
                    opacity: loading ? 0.7 : 1
                  }}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  style={{
                    background: input.trim() && !loading ? C.primary : C.bgLighter,
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s',
                    flexShrink: 0
                  }}
                >
                  <Send size={18} style={{ marginLeft: '2px' }} />
                </button>
              </form>
            </div>
        </>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .dot-pulse {
          position: relative;
          left: -9999px;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #9ca3af;
          color: #9ca3af;
          box-shadow: 9999px 0 0 -5px;
          animation: dot-pulse 1.5s infinite linear;
          animation-delay: 0.25s;
        }
        .dot-pulse::before, .dot-pulse::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
          width: 6px;
          height: 6px;
          border-radius: 5px;
          background-color: #9ca3af;
          color: #9ca3af;
        }
        .dot-pulse::before {
          box-shadow: 9984px 0 0 -5px;
          animation: dot-pulse-before 1.5s infinite linear;
          animation-delay: 0s;
        }
        .dot-pulse::after {
          box-shadow: 10014px 0 0 -5px;
          animation: dot-pulse-after 1.5s infinite linear;
          animation-delay: 0.5s;
        }
        @keyframes dot-pulse-before {
          0% { box-shadow: 9984px 0 0 -5px; }
          30% { box-shadow: 9984px 0 0 2px; }
          60%, 100% { box-shadow: 9984px 0 0 -5px; }
        }
        @keyframes dot-pulse {
          0% { box-shadow: 9999px 0 0 -5px; }
          30% { box-shadow: 9999px 0 0 2px; }
          60%, 100% { box-shadow: 9999px 0 0 -5px; }
        }
        @keyframes dot-pulse-after {
          0% { box-shadow: 10014px 0 0 -5px; }
          30% { box-shadow: 10014px 0 0 2px; }
          60%, 100% { box-shadow: 10014px 0 0 -5px; }
        }
      `}} />
    </div>
  );
}
