import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  MessageSquare,
  Users,
  Clock,
  Sparkles,
  Layers,
  CheckCheck,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Button from '../components/ui/Button';

export default function Chat() {
  const { user } = useAuth();
  const { socket, isUserOnline, joinConversation, leaveConversation } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch all user conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const res = await api.get('/chat/conversations');
        if (res.data.success) {
          setConversations(res.data.conversations || []);
          if (res.data.conversations?.length > 0) {
            setActiveConversation(res.data.conversations[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    joinConversation(activeConversation._id);

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chat/conversations/${activeConversation._id}/messages`);
        if (res.data.success) {
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error('Failed to load messages:', err);
      }
    };

    fetchMessages();

    return () => {
      leaveConversation(activeConversation._id);
    };
  }, [activeConversation]);

  // Real-time socket message handler
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (activeConversation && msg.conversation === activeConversation._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleUserTyping = ({ conversationId }) => {
      if (activeConversation && conversationId === activeConversation._id) {
        setPartnerTyping(true);
      }
    };

    const handleUserStopTyping = ({ conversationId }) => {
      if (activeConversation && conversationId === activeConversation._id) {
        setPartnerTyping(false);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
    };
  }, [socket, activeConversation]);

  // Auto-scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, partnerTyping]);

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (socket && activeConversation) {
      socket.emit('typing', {
        conversationId: activeConversation._id,
        userName: user?.name
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { conversationId: activeConversation._id });
      }, 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    const content = messageInput.trim();
    setMessageInput('');

    if (socket) {
      socket.emit('stop_typing', { conversationId: activeConversation._id });
    }

    try {
      const res = await api.post(`/chat/conversations/${activeConversation._id}/messages`, {
        content
      });
      if (res.data.success) {
        // Appended via socket or locally
        setMessages((prev) => {
          if (prev.some((m) => m._id === res.data.message._id)) return prev;
          return [...prev, res.data.message];
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  const getPartner = (conv) => {
    return conv.participants?.find((p) => p._id !== user?.id) || { name: 'Exchange Partner' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="h-[80vh] rounded-3xl bg-white dark:bg-[#13151c] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-brand-500" />
              <span>Exchange Chats</span>
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {conversations.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                <Users className="h-8 w-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p>No active chat rooms yet.</p>
                <p className="text-[10px] text-slate-500">
                  Real-time chat unlocks once an exchange request is accepted.
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const partner = getPartner(conv);
                const online = isUserOnline(partner._id);
                const isActive = activeConversation?._id === conv._id;

                return (
                  <button
                    key={conv._id}
                    onClick={() => setActiveConversation(conv)}
                    className={`w-full p-4 text-left flex items-start gap-3 transition ${
                      isActive
                        ? 'bg-brand-500/10 dark:bg-brand-500/15'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${partner.name}`}
                        alt={partner.name}
                        className="h-10 w-10 rounded-xl object-cover"
                      />
                      {online && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#13151c]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {partner.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(conv.lastActivity || conv.updatedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {conv.exchangeRequest?.offeredSkill} ⇄ {conv.exchangeRequest?.requestedSkill}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane: Active Chat Room */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-[#0c0d12]/50">
            {/* Chat Room Header */}
            <div className="p-4 bg-white dark:bg-[#13151c] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${getPartner(activeConversation).name}`}
                  alt="Partner"
                  className="h-9 w-9 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <span>{getPartner(activeConversation).name}</span>
                    {isUserOnline(getPartner(activeConversation)._id) ? (
                      <span className="text-[10px] font-mono text-emerald-500 font-semibold">● Online</span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400">Offline</span>
                    )}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Exchange: {activeConversation.exchangeRequest?.offeredSkill} ⇄ {activeConversation.exchangeRequest?.requestedSkill}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-500 font-bold">
                  Bilateral Chat Unlocked
                </span>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <ShieldCheck className="h-8 w-8 text-brand-500 mx-auto" />
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Secure Peer Channel Established
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Say hello to your exchange partner, discuss session timing, and share learning material!
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender?._id === user?.id || m.sender === user?.id;

                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                          isMe
                            ? 'bg-brand-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-[#1a1d27] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-tl-none'
                        }`}
                      >
                        <p>{m.content}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 px-1">
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  );
                })
              )}

              {partnerTyping && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                  <span className="animate-pulse">Typing...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-4 bg-white dark:bg-[#13151c] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type a coordination message or session proposal..."
                value={messageInput}
                onChange={handleInputChange}
                className="flex-1 text-xs rounded-xl bg-slate-50 dark:bg-[#181a24] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Button type="submit" variant="primary" size="sm" icon={Send}>
                Send
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-xs text-slate-400">
            Select a conversation on the left to start messaging.
          </div>
        )}
      </div>
    </div>
  );
}
