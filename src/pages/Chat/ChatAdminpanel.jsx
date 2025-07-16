import React, { useEffect, useState, useRef } from 'react';
import { db } from './firebase';
import './ChatAdminpanel.css';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const getInitials = (isAdmin, uid) => isAdmin ? "A" : (uid ? uid.slice(-2).toUpperCase() : "U");

const quickReplies = [
  "Hello! How can I help you today?",
  "Please provide more details.",
  "Your request is being processed.",
  "Thank you for reaching out.",
  "Is there anything else I can assist with?"
];

const ChatAdminpanel = () => {
  const [userChats, setUserChats] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [theme, setTheme] = useState('light');
  const [escalated, setEscalated] = useState(false);
  const [search, setSearch] = useState('');
  const [userTyping, setUserTyping] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [adminNotes, setAdminNotes] = useState({});
  const [noteInput, setNoteInput] = useState('');
  const [blockedUsers, setBlockedUsers] = useState({});
  const audioRef = useRef(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [announcementStatus, setAnnouncementStatus] = useState('');
  const [userProfiles, setUserProfiles] = useState({});
  const [editProfile, setEditProfile] = useState({});

  // Track mount status to avoid state updates on unmounted component
  const isMounted = useRef(true);
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Helper for safe status update
  const safeSetProfileStatus = (msg) => {
    if (isMounted.current) {
      setProfileStatus(msg);
      setTimeout(() => {
        if (isMounted.current) setProfileStatus('');
      }, 2000);
    }
  };
  const safeSetAnnouncementStatus = (msg) => {
    if (isMounted.current) {
      setAnnouncementStatus(msg);
      setTimeout(() => {
        if (isMounted.current) setAnnouncementStatus('');
      }, 2000);
    }
  };

  // Function to save announcement to Firebase
  const handleSaveAnnouncement = () => {
    if (!announcement.trim()) return;
    db.ref('global_announcement').set({
      text: announcement,
      timestamp: Date.now()
    });
    setAnnouncement('');
    safeSetAnnouncementStatus('Announcement sent!');
  };

  useEffect(() => {
    const ref = db.ref('users');
    ref.on('value', (snapshot) => {
      setUserProfiles(snapshot.val() || {});
    });
    return () => ref.off();
  }, []);

  // Listen for escalation flag for selected user
  useEffect(() => {
    if (!selectedUser) {
      setEscalated(false);
      return;
    }
    const escRef = db.ref(`support_chat/${selectedUser}/escalated`);
    escRef.on('value', (snapshot) => {
      setEscalated(!!snapshot.val());
    });
    return () => escRef.off();
  }, [selectedUser]);

  const handleProfileChange = (field, value) => {
    setEditProfile(prev => ({ ...prev, [field]: value }));
  };
  const handleSaveProfile = () => {
    db.ref(`users/${selectedUser}`).update(editProfile);
    setEditProfile({});
    setEditingProfile(false);
    safeSetProfileStatus('Profile updated!');
  };

  // Listen for user typing status
  useEffect(() => {
    if (!selectedUser) return;
    const typingRef = db.ref(`support_chat/${selectedUser}/userTyping`);
    typingRef.on('value', (snapshot) => {
      setUserTyping(prev => ({ ...prev, [selectedUser]: !!snapshot.val() }));
    });
    return () => typingRef.off();
  }, [selectedUser]);

  // Listen for unread counts (simulate: count messages with unread flag)
  useEffect(() => {
    const ref = db.ref('support_chat');
    ref.on('value', (snapshot) => {
      const chats = snapshot.val() || {};
      const counts = {};
      Object.keys(chats).forEach(uid => {
        const msgs = Object.values(chats[uid] || {})
          .filter(msg => typeof msg === 'object' && typeof msg.text === 'string');
        counts[uid] = msgs.filter(msg => msg.isAdmin !== true && !msg.readByAdmin).length;
      });
      setUnreadCounts(counts);
    });
    return () => ref.off();
  }, []);

  // Listen for blocked users
  useEffect(() => {
    const ref = db.ref('blocked_users');
    ref.on('value', (snapshot) => {
      setBlockedUsers(snapshot.val() || {});
    });
    return () => ref.off();
  }, []);

  // Listen for admin notes
  useEffect(() => {
    const ref = db.ref('admin_notes');
    ref.on('value', (snapshot) => {
      setAdminNotes(snapshot.val() || {});
    });
    return () => ref.off();
  }, []);

  // Listen for all chats
  useEffect(() => {
    const ref = db.ref('support_chat');
    ref.on('value', (snapshot) => {
      setUserChats(snapshot.val() || {});
    });
    return () => ref.off();
  }, []);

  // Set/Clear typing flag as admin types
  const handleAdminInput = (e) => {
    setAdminMessage(e.target.value);
    if (selectedUser) {
      db.ref(`support_chat/${selectedUser}/adminTyping`).set(e.target.value.length > 0);
    }
  };

  // Clear typing flag after sending
  const handleSend = (e) => {
    e.preventDefault();
    if (!adminMessage.trim() || !selectedUser) return;
    if (blockedUsers[selectedUser]) {
      alert("User is blocked.");
      return;
    }
    const messagesRef = db.ref(`support_chat/${selectedUser}`);
    messagesRef.push({
      text: adminMessage,
      isAdmin: true,
      timestamp: Date.now(),
    });
    setAdminMessage('');
    db.ref(`support_chat/${selectedUser}/adminTyping`).set(false);
  };

  // Helper to check if a user has any escalated messages
  const getEscalationCount = (uid) => {
    const chats = userChats[uid];
    if (!chats) return 0;
    return Object.values(chats).filter(msg => msg && typeof msg === 'object' && msg.escalate).length;
  };

  // Export chat as text
  const handleExportChat = () => {
    if (!selectedUser || !userChats[selectedUser]) return;
    const lines = Object.values(userChats[selectedUser])
      .filter(msg => typeof msg === 'object' && typeof msg.text === 'string')
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(msg =>
        `[${formatTime(msg.timestamp)}] ${msg.isAdmin ? 'Admin' : 'User'}: ${msg.text}`
      );
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedUser}_chat.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete a message
  const handleDeleteMessage = (msgKey) => {
    if (!selectedUser) return;
    db.ref(`support_chat/${selectedUser}/${msgKey}`).remove();
  };

  // Block user
  const handleBlockUser = () => {
    if (!selectedUser) return;
    db.ref(`blocked_users/${selectedUser}`).set(true);
  };

  // Unblock user
  const handleUnblockUser = () => {
    if (!selectedUser) return;
    db.ref(`blocked_users/${selectedUser}`).remove();
  };

  // Save admin note
  const handleSaveNote = () => {
    if (!selectedUser) return;
    db.ref(`admin_notes/${selectedUser}`).set(noteInput);
    setNoteInput('');
  };

  // Mark all as read when opening chat
  useEffect(() => {
    if (!selectedUser || !userChats[selectedUser]) return;
    Object.entries(userChats[selectedUser]).forEach(([key, msg]) => {
      if (msg && typeof msg === 'object' && !msg.isAdmin && !msg.readByAdmin && typeof msg.text === 'string') {
        db.ref(`support_chat/${selectedUser}/${key}/readByAdmin`).set(true);
      }
    });
  }, [selectedUser, userChats]);

  // Notification sound for new user messages
  useEffect(() => {
    if (!selectedUser || !userChats[selectedUser]) return;
    const lastMsg = Object.values(userChats[selectedUser])
      .filter(msg => typeof msg === 'object' && typeof msg.text === 'string')
      .sort((a, b) => b.timestamp - a.timestamp)[0];
    if (lastMsg && !lastMsg.isAdmin && !lastMsg.readByAdmin && audioRef.current) {
      audioRef.current.play();
    }
  }, [userChats, selectedUser]);

  // Filter users by search
  const filteredUserIds = Object.keys(userChats)
    .filter(uid => typeof uid === 'string' && uid.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <audio ref={audioRef} src="/notification.mp3.wav" preload="auto" />
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className={`theme-toggle-btn ${theme}`}
      >
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      <div className={`admin-dashboard-main ${theme}`}>
        {/* Sidebar */}
        <div className={`sidebar ${theme}`}>
          <h3 className="sidebar-title">Users</h3>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="sidebar-search"
          />
          <div className="sidebar-stats">
            <div><b>Total Users:</b> {Object.keys(userChats).length}</div>
            <div><b>Active Chats:</b> {Object.values(userChats).filter(chat => chat && Object.keys(chat).length > 0).length}</div>
            <div><b>Blocked Users:</b> {Object.keys(blockedUsers).length}</div>
          </div>
          <div className="sidebar-announcement">
            <h3>Global Announcement</h3>
            <textarea
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              placeholder="Type announcement to show all users..."
              className="announcement-textarea"
            />
            <button onClick={handleSaveAnnouncement} className="announcement-btn">Send Announcement</button>
            {announcementStatus && <span className="announcement-status">{announcementStatus}</span>}
          </div>
          <ul className="sidebar-userlist">
            {filteredUserIds.length === 0 ? (
              <li className="sidebar-userlist-empty">No users yet.</li>
            ) : (
              filteredUserIds
                .filter(uid => typeof uid === 'string')
                .map(uid => {
                  const escalationCount = getEscalationCount(uid);
                  return (
                    <li key={uid}>
                      <button
                        onClick={() => setSelectedUser(uid)}
                        className={`userlist-btn${selectedUser === uid ? ' selected' : ''}${escalationCount > 0 ? ' escalated' : ''} ${theme}`}
                      >
                        <span className="userlist-avatar">{getInitials(false, uid)}</span>
                        <span className="userlist-uid">{uid}</span>
                        {userTyping[uid] && <span className="userlist-typing">typing...</span>}
                        {unreadCounts[uid] > 0 && <span className="userlist-unread">{unreadCounts[uid]}</span>}
                        {blockedUsers[uid] && <span className="userlist-blocked">Blocked</span>}
                      </button>
                    </li>
                  );
                })
            )}
          </ul>
        </div>
        {/* Chat Area */}
        <div className="main-chat-area">
          <div className={`chat-header ${theme}`}>
            {selectedUser ? (
              <div className="chat-header-row">
                <h3 className="chat-header-title">
                  Chat with <span className="chat-header-uid">{selectedUser}</span>
                </h3>
                <div>
                  <button onClick={() => setShowUserInfo(true)} className="chat-header-btn">User Info</button>
                  <button onClick={handleExportChat} className="chat-header-btn export">Export</button>
                  {blockedUsers[selectedUser] ? (
                    <button onClick={handleUnblockUser} className="chat-header-btn unblock">Unblock</button>
                  ) : (
                    <button onClick={handleBlockUser} className="chat-header-btn block">Block</button>
                  )}
                </div>
              </div>
            ) : (
              <h3 className="chat-header-empty">Select a user to view chat.</h3>
            )}
          </div>
          {/* Escalation Banner and Button */}
          {selectedUser && (
            <div className="chat-escalation">
              {escalated ? (
                <div className="escalation-banner">
                  <span>Escalated: Human agent has taken over this chat.</span>
                  <button
                    onClick={() => db.ref(`support_chat/${selectedUser}/escalated`).set(false)}
                    className="escalation-btn deescalate"
                  >
                    De-escalate
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => db.ref(`support_chat/${selectedUser}/escalated`).set(true)}
                  className="escalation-btn escalate"
                >
                  Escalate to Human Agent
                </button>
              )}
            </div>
          )}
          {/* Admin Notes */}
          {selectedUser && (
            <div className="admin-notes">
              <div className="admin-notes-label">Admin Notes:</div>
              <textarea
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                placeholder="Add a note for this user..."
                className="admin-notes-textarea"
              />
              <button onClick={handleSaveNote} className="admin-notes-btn">Save Note</button>
              {adminNotes[selectedUser] && (
                <div className="admin-notes-saved">
                  <b>Saved:</b> {adminNotes[selectedUser]}
                </div>
              )}
            </div>
          )}
          {/* Quick Replies */}
          {selectedUser && (
            <div className="quick-replies">
              {quickReplies.map((reply, idx) => (
                <button key={idx} type="button" onClick={() => setAdminMessage(reply)} className="quick-reply-btn">{reply}</button>
              ))}
            </div>
          )}
          <div className={`chat-messages ${theme}`}>
            {selectedUser && userChats[selectedUser] ? (
              Object.entries(userChats[selectedUser])
                .filter(([key, msg]) =>
                  typeof msg === 'object' &&
                  msg !== null &&
                  typeof msg.text === 'string'
                )
                .sort((a, b) => a[1].timestamp - b[1].timestamp)
                .map(([msgKey, msg], idx) => (
                  <div key={msgKey} className={`chat-message-row${msg.isAdmin ? ' admin' : ''}`}>
                    <div className={`chat-avatar${msg.isAdmin ? ' admin' : ''}`}>{getInitials(msg.isAdmin, selectedUser)}</div>
                    <div className={`chat-bubble${msg.escalate ? ' escalate' : ''}${msg.isAdmin ? ' admin' : ''}`}>
                      <div className="chat-bubble-label">{msg.isAdmin ? "Admin" : "User"}</div>
                      <div className="chat-bubble-text">{msg.text}</div>
                      <div className="chat-bubble-time">{formatTime(msg.timestamp)}</div>
                      {msg.escalate && (
                        <div className="chat-bubble-escalated">
                          Escalated to human support
                        </div>
                      )}
                      <button onClick={() => handleDeleteMessage(msgKey)} className="chat-bubble-delete">Delete</button>
                    </div>
                  </div>
                ))
            ) : (
              <div className="chat-messages-empty">No messages yet.</div>
            )}
          </div>
          {/* Reply Box */}
          {selectedUser && (
            <form onSubmit={handleSend} className={`chat-reply-form ${theme}`}>
              <input
                value={adminMessage}
                onChange={handleAdminInput}
                placeholder="Type a reply..."
                className="chat-reply-input"
              />
              <button type="submit" className="chat-reply-btn">Send</button>
            </form>
          )}
        </div>
      </div>
      {/* User Info Popup */}
      {showUserInfo && selectedUser && (
        <div className="user-info-popup-bg">
          <div className={`user-info-popup ${theme}`}>
            <button onClick={() => setShowUserInfo(false)} className="user-info-close">Close</button>
            <h2>User Info</h2>
            <div><b>User ID:</b> {selectedUser}</div>
            <div><b>Name:</b> {userProfiles[selectedUser]?.name || "N/A"}</div>
            <div><b>Email:</b> {userProfiles[selectedUser]?.email || "N/A"}</div>
            <div><b>KYC Status:</b> {userProfiles[selectedUser]?.kycStatus || "N/A"}</div>
            <div><b>Role:</b> {userProfiles[selectedUser]?.role || "N/A"}</div>
            <div><b>Blocked:</b> {blockedUsers[selectedUser] ? "Yes" : "No"}</div>
            <div><b>Admin Notes:</b> {adminNotes[selectedUser] || "None"}</div>
            {!editingProfile ? (
              <button
                onClick={() => {
                  setEditProfile({
                    name: userProfiles[selectedUser]?.name ?? "",
                    email: userProfiles[selectedUser]?.email ?? "",
                    kycStatus: userProfiles[selectedUser]?.kycStatus ?? "",
                    role: userProfiles[selectedUser]?.role ?? ""
                  });
                  setEditingProfile(true);
                }}
                className="user-info-edit"
              >
                Edit Profile
              </button>
            ) : (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  db.ref(`users/${selectedUser}`).update(editProfile);
                  setEditingProfile(false);
                  safeSetProfileStatus('Profile updated!');
                }}
                className="user-info-edit-form"
              >
                <div>
                  <label>Name:</label>
                  <input
                    value={editProfile.name}
                    onChange={e => setEditProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    value={editProfile.email}
                    onChange={e => setEditProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label>KYC Status:</label>
                  <input
                    value={editProfile.kycStatus}
                    onChange={e => setEditProfile(prev => ({ ...prev, kycStatus: e.target.value }))}
                  />
                </div>
                <div>
                  <label>Role:</label>
                  <input
                    value={editProfile.role}
                    onChange={e => setEditProfile(prev => ({ ...prev, role: e.target.value }))}
                  />
                </div>
                <button type="submit" className="user-info-save">Save Profile</button>
                <div className="user-info-actions">
                  <button
                    type="button"
                    onClick={() => {
                      db.ref(`users/${selectedUser}/kycStatus`).set('verified');
                      safeSetProfileStatus('KYC status set to verified!');
                    }}
                    className="user-info-verify"
                  >
                    Verify KYC
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const email = userProfiles[selectedUser]?.email;
                      if (!email) {
                        safeSetProfileStatus('No email found for this user.');
                        return;
                      }
                      try {
                        const auth = getAuth();
                        await sendPasswordResetEmail(auth, email);
                        safeSetProfileStatus('Password reset email sent!');
                      } catch (err) {
                        safeSetProfileStatus('Failed to send reset email.');
                      }
                    }}
                    className="user-info-reset"
                  >
                    Reset Password
                  </button>
                  {blockedUsers[selectedUser] ? (
                    <button
                      type="button"
                      onClick={handleUnblockUser}
                      className="user-info-unblock"
                    >
                      Unblock User
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBlockUser}
                      className="user-info-block"
                    >
                      Block User
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="user-info-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete this user? This cannot be undone.")) {
                      await db.ref(`users/${selectedUser}`).remove();
                      await db.ref(`support_chat/${selectedUser}`).remove();
                      await db.ref(`admin_notes/${selectedUser}`).remove();
                      await db.ref(`blocked_users/${selectedUser}`).remove();
                      setShowUserInfo(false);
                      setSelectedUser(null);
                    }
                  }}
                  className="user-info-delete"
                >
                  Delete User
                </button>
              </form>
            )}
            {profileStatus && (
              <div className="user-info-status">{profileStatus}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAdminpanel;