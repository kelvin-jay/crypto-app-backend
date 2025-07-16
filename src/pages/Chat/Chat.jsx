import React, { useState, useEffect, useRef } from 'react';
import { db } from './firebase';
import Picker from 'emoji-picker-react';
import './Chat.css';

const getUserId = () => {
  let userId = localStorage.getItem('chatUserId');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatUserId', userId);
  }
  return userId;
};

const getUserName = () => {
  let userName = localStorage.getItem('chatUserName');
  return userName || '';
};

const Chat = () => {
  const userId = getUserId();

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userName, setUserName] = useState(getUserName());
  const [showNamePrompt, setShowNamePrompt] = useState(!getUserName());
  const [isMinimized, setIsMinimized] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [soundOn, setSoundOn] = useState(() => {
    const saved = localStorage.getItem('chatSoundOn');
    return saved === null ? true : saved === 'true';
  });
  const [feedbackMsgId, setFeedbackMsgId] = useState(null);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  const [file, setFile] = useState(null);
  const [escalated, setEscalated] = useState(false);
  const [adminTyping, setAdminTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const typingTimeout = useRef(null);

  const suggestions = [
    "How can I reset my password?",
    "How can I withdraw funds?",
    "Where can I see my transaction history?",
    "How do I contact support?",
    "Tell me about your security features."
  ];
  // ...existing imports...
const [globalAnnouncement, setGlobalAnnouncement] = useState(null);

useEffect(() => {
  const ref = db.ref('announcements/latest');
  ref.on('value', (snapshot) => {
    setGlobalAnnouncement(snapshot.val());
  });
  return () => ref.off();
}, []);
// ...existing code...

  // Listen for escalation flag
  useEffect(() => {
    const escRef = db.ref(`support_chat/${userId}/escalated`);
    escRef.on('value', (snapshot) => {
      setEscalated(!!snapshot.val());
    });
    return () => escRef.off();
  }, [userId]);

  // Listen to all messages in the public support_chat room
  useEffect(() => {
    const messagesRef = db.ref(`support_chat/${userId}`);
    messagesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const loadedMessages = Object.keys(data)
          .filter(key => typeof data[key] === 'object' && data[key].text) // filter out adminTyping/escalated
          .map((key) => ({
            key,
            ...data[key],
          }));
        loadedMessages.sort((a, b) => a.timestamp - b.timestamp);
        setMessages(loadedMessages);
        localStorage.setItem('chatMessages', JSON.stringify(loadedMessages));
      } else {
        setMessages([]);
        localStorage.removeItem('chatMessages');
      }
    });

    return () => {
      messagesRef.off();
    };
  }, [showChat, userId]);

  // Listen for admin typing indicator
  useEffect(() => {
    const typingRef = db.ref(`support_chat/${userId}/adminTyping`);
    typingRef.on('value', (snapshot) => {
      setAdminTyping(!!snapshot.val());
    });
    return () => typingRef.off();
  }, [userId]);

  // Show name prompt if user name is not set
  useEffect(() => {
    const storedUserName = localStorage.getItem('chatUserName');
    if (!storedUserName) {
      setShowNamePrompt(true);
    } else {
      setUserName(storedUserName);
      setShowNamePrompt(false);
    }
  }, []);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (showChat) {
      setUnreadCount(0);
    }
  }, [showChat]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat, isMinimized]);

  // Show popup after 15 seconds
  useEffect(() => {
    const hasPopupBeenShown = localStorage.getItem('hasPopupBeenShown');
    if (!hasPopupBeenShown) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        localStorage.setItem('hasPopupBeenShown', 'true');
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('chatSoundOn', soundOn);
  }, [soundOn]);

  // Typing indicator for user
  useEffect(() => {
    if (isTyping) {
      db.ref(`support_chat/${userId}/userTyping`).set(true);
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        db.ref(`support_chat/${userId}/userTyping`).set(false);
        setIsTyping(false);
      }, 2000);
    }
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, [isTyping, userId]);

  const handleSuggestionClick = (suggestion) => {
    setNewMessage(suggestion);
    setIsTyping(true);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('chatUserName', userName);
      setShowNamePrompt(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    setIsTyping(true);
  };

  const handleSoundToggle = () => setSoundOn((prev) => !prev);

  const handleMinimize = () => setIsMinimized(true);

  const handleRestore = () => {
    setIsMinimized(false);
    setShowChat(true);
    setUnreadCount(0);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleFeedback = (msgKey, value) => {
    setFeedbackGiven((prev) => ({ ...prev, [msgKey]: value }));
  };

  // Main message send handler
  const handleSubmit = async (e, message) => {
    if (e) e.preventDefault();
    if (showNamePrompt) return;
    const msg = message || newMessage;
    if (!msg.trim() && !file) return;

    const messagesRef = db.ref(`support_chat/${userId}`);
    let fileUrl = null;

    // File upload logic (if any)
    if (file) {
      // Implement your file upload logic here if needed
    }

    // Send user message
    await messagesRef.push({
      text: msg,
      userId,
      userName,
      isAdmin: false,
      timestamp: Date.now(),
      fileUrl,
      fileName: file ? file.name : null,
    });

    // Only reply if not escalated
    if (!escalated) {
      setBotTyping(true);
      setTimeout(() => {
        const botReply = getBotReply(msg, userName);
        messagesRef.push({
          text: botReply,
          isAdmin: true,
          timestamp: Date.now(),
        });
        setBotTyping(false);
      }, 1200);
    }

    setNewMessage('');
    setFile(null);
  };

  // Smarter bot reply function
const getBotReply = (msg, userName) => {
  const lowerMsg = msg.toLowerCase();

  // Greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)/i.test(lowerMsg)) {
    return `Hello ${userName || 'there'}! 👋 How can I assist you today?`;
  }

  // Password reset
  if (/password|reset.*password/.test(lowerMsg)) {
    return `Hi ${userName || 'there'}, you can reset your password from your profile settings. If you have trouble, let us know!`;
  }

  // Withdrawals
  if (/withdraw|cashout|payout/.test(lowerMsg)) {
    return `Withdrawals can be made from your wallet page. Please ensure your account is verified.`;
  }

  // Deposits
  if (/deposit|fund|add money/.test(lowerMsg)) {
    return `To deposit funds, go to your wallet and click "Deposit". If you need help, just ask!`;
  }

  // Transaction history
  if (/history|transactions|statement/.test(lowerMsg)) {
    return `Your transaction history is available in your dashboard under "History".`;
  }

  // Support
  if (/support|help|agent|contact/.test(lowerMsg)) {
    return `You can chat with us here for support. If you need a human agent, just type "escalate".`;
  }

  // Security
  if (/security|safe|protect|secure/.test(lowerMsg)) {
    return `We use industry-standard encryption and security practices to keep your assets safe.`;
  }

  // Bonus
  if (/bonus|reward|promo/.test(lowerMsg)) {
    return `Bonuses and promotions are credited automatically if you qualify. Check our promotions page for more info.`;
  }

  // Escalate
  if (/escalate|human|real person/.test(lowerMsg)) {
    return `I can escalate this chat to a human agent. Please wait a moment while I connect you.`;
  }

  // Unknown or general
  if (lowerMsg.length < 5) {
    return `Could you please provide more details so I can assist you better?`;
  }

  // Fallback: echo with friendly message
  return `Hi ${userName || 'there'}, thanks for your message! Our support team will review: "${msg}"`;
};


  const onEmojiClick = (event, emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="chat-container">
      <audio ref={audioRef} src="/notification.mp3.wav" preload="auto" />
      {showPopup && !showChat && (
        <div className="chat-popup-notification">
          <div className="chat-popup-header" style={{ justifyContent: 'center' }}>
            <span style={{ fontSize: 38, marginRight: 12 }}>👋</span>
          </div>
          <div className="chat-popup-body">
            <span style={{ color: '#09005c', fontWeight: 700, fontSize: 18 }}>
              Welcome to Crypto Asset Tradestop!
            </span>
            <div style={{ fontSize: 13, color: '#4CAF50', fontWeight: 500 }}>
              Secure. Fast. Friendly.
            </div>
            <div style={{ color: '#222', marginTop: 8 }}>
              Whether you have a specific question or need assistance, we’re here for you.<br />
              <span style={{ color: '#007bff', fontWeight: 500 }}>What would you like to know?</span>
            </div>
          </div>
          <div className="chat-popup-actions">
            <button className="chat-popup-btn chat-popup-btn-primary" onClick={() => { setShowChat(true); setShowPopup(false); }}>
              <span role="img" aria-label="chat" style={{ marginRight: 6 }}>💬</span>
              Let's Chat
            </button>
            <button className="chat-popup-btn chat-popup-btn-secondary" onClick={() => setShowPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {isMinimized && (
        <button className="chat-button" style={{ bottom: 0, right: 0 }} onClick={handleRestore}>
          💬
          {unreadCount > 0 && (
            <span className="chat-unread-badge">{unreadCount}</span>
          )}
        </button>
      )}

      {!isMinimized && (
        <button className="chat-button" onClick={() => setShowChat(!showChat)}>
          💬
          {unreadCount > 0 && (
            <span className="chat-unread-badge">{unreadCount}</span>
          )}
        </button>
      )}
       {/* Inside your chat-box div, just after the chat-header */}
{globalAnnouncement && (
  <div style={{
    background: '#fffbe6',
    color: '#b8860b',
    padding: '10px 18px',
    borderRadius: 8,
    margin: '12px 24px 0 24px',
    fontWeight: 600,
    fontSize: 15,
    border: '1px solid #ffe58f'
  }}>
    📢 {globalAnnouncement.text}
  </div>
)}
      <div className={`chat-box ${showChat && !isMinimized ? 'show' : ''}`}>
        <div className="chat-header">
          <h2>Customer Support</h2>
          <div style={{ display: 'flex', gap: 10 }}>
            <button title={soundOn ? "Mute" : "Unmute"} onClick={handleSoundToggle} style={{ color: soundOn ? "#ffd700" : "#fff" }}>
              {soundOn ? "🔊" : "🔇"}
            </button>
            <button title="Minimize" onClick={handleMinimize} style={{ color: "#ffd700", fontSize: "30px" }}>
              _
            </button>
            <button title="Close" onClick={() => setShowChat(false)} style={{ color: "#ffd700", fontSize: "30px" }}>
              ×
            </button>
          </div>
        </div>
        <div className="chat-messages-container">
          <div className="chat-messages">
            {showNamePrompt && (
              <div className="help-suggestion">
                <form onSubmit={handleNameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label htmlFor="chat-name" style={{ fontWeight: 500, color: '#09005c' }}>What's your name?</label>
                  <input
                    id="chat-name"
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    style={{ padding: 8, borderRadius: 8, border: '1px solid #bbb' }}
                  />
                  <button type="submit" className="chat-popup-btn chat-popup-btn-primary">Continue</button>
                </form>
              </div>
            )}
            {!showNamePrompt && messages.length === 0 && (
              <div className="help-suggestion">
                <p>How can we help you today?</p>
                <div className="suggestion-list">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="suggestion-btn"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
           {!showNamePrompt && messages
  .filter(message => typeof message.text === 'string')
  .map((message) => (
    <div
      className={`chat-message-bubble ${message.isAdmin ? 'bot' : 'user'}`}
      key={message.key}
      onMouseEnter={() => message.isAdmin && setFeedbackMsgId(message.key)}
      onMouseLeave={() => setFeedbackMsgId(null)}
    >
      {message.fileUrl && (
        <div style={{ marginBottom: 6 }}>
          <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff', textDecoration: 'underline' }}>
            📎 {message.fileName}
          </a>
        </div>
      )}
      <span>{message.text}</span>
                {message.isAdmin && feedbackMsgId === message.key && !feedbackGiven[message.key] && (
                  <div style={{ marginTop: 8 }}>
                    <span style={{ marginRight: 8, color: '#888' }}>Was this helpful?</span>
                    <button style={{ marginRight: 4 }} onClick={() => handleFeedback(message.key, 'yes')}>👍</button>
                    <button onClick={() => handleFeedback(message.key, 'no')}>👎</button>
                  </div>
                )}
                {message.isAdmin && feedbackGiven[message.key] && (
                  <div style={{ marginTop: 8, color: feedbackGiven[message.key] === 'yes' ? '#4CAF50' : '#e74c3c' }}>
                    {feedbackGiven[message.key] === 'yes' ? "Thanks for your feedback!" : "We'll try to do better!"}
                  </div>
                )}
              </div>
            ))}
            {botTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '8px 0 8px auto',
                maxWidth: 120
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#dcf8c6',
                  color: '#007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  marginRight: 8
                }}>
                  A
                </div>
                <div style={{
                  background: '#dcf8c6',
                  borderRadius: 18,
                  padding: '10px 18px',
                  fontSize: 16,
                  color: '#222',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <span className="typing">
                    <span style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      background: '#888',
                      borderRadius: '50%',
                      marginRight: 2,
                      animation: 'blink 1s infinite alternate'
                    }}></span>
                    <span style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      background: '#888',
                      borderRadius: '50%',
                      marginRight: 2,
                      animation: 'blink 1s 0.2s infinite alternate'
                    }}></span>
                    <span style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      background: '#888',
                      borderRadius: '50%',
                      animation: 'blink 1s 0.4s infinite alternate'
                    }}></span>
                  </span>
                  <span style={{ marginLeft: 8 }}>Typing...</span>
                </div>
              </div>
            )}
            {isTyping && !botTyping && (
              <div style={{ color: '#888', fontSize: 13, margin: '8px 0 0 8px' }}>
                You are typing...
              </div>
            )}
            {adminTyping && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '8px 0 8px auto',
                maxWidth: 180
              }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#dcf8c6',
                  color: '#007bff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 16,
                  marginRight: 8
                }}>
                  A
                </div>
                <div style={{
                  background: '#dcf8c6',
                  borderRadius: 18,
                  padding: '10px 18px',
                  fontSize: 16,
                  color: '#222',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                  <span className="typing">
                    <span style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      background: '#888',
                      borderRadius: '50%',
                      marginRight: 2,
                      animation: 'blink 1s infinite alternate'
                    }}></span>
                    <span style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      background: '#888',
                      borderRadius: '50%',
                      marginRight: 2,
                      animation: 'blink 1s 0.2s infinite alternate'
                    }}></span>
                    <span style={{
                      display: 'inline-block',
                      width: 6,
                      height: 6,
                      background: '#888',
                      borderRadius: '50%',
                      animation: 'blink 1s 0.4s infinite alternate'
                    }}></span>
                  </span>
                  <span style={{ marginLeft: -8, fontSize: 14, display: 'flex' }}>Support typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {!showNamePrompt && (
          <div className="chat-input">
            <form onSubmit={handleSubmit}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 22,
                  cursor: 'pointer',
                  marginRight: 4
                }}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                title="Emoji"
                tabIndex={-1}
              >😊</button>
              {showEmojiPicker && (
                <div style={{ position: 'absolute', bottom: 60, left: 10, zIndex: 2000 }}>
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                onFocus={() => setIsTyping(true)}
                placeholder="Type a message..."
                style={{ minWidth: 0 }}
              />
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="chat-file-upload"
                onChange={handleFileChange}
              />
              <label htmlFor="chat-file-upload" style={{ cursor: 'pointer', marginRight: 4 }}>
                📎
              </label>
              {file && (
                <span style={{ fontSize: 12, color: '#007bff', marginRight: 4 }}>
                  {file.name}
                </span>
              )}
              <button type="submit">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;