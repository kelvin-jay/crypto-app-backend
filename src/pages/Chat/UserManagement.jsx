import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import UserBalanceEditor from "../Chat/UserBalanceEditor";
import "./UserManagement.css";

const supportedCoins = [
  { symbol: "USD", name: "US Dollar" },
  { symbol: "BTC", name: "Bitcoin" },
  { symbol: "ETH", name: "Ethereum" },
  { symbol: "USDT", name: "Tether" },
  { symbol: "BNB", name: "Binance Coin" },
  { symbol: "SOL", name: "Solana" },
  { symbol: "DOGE", name: "Dogecoin" },
];

const UserManagement = () => {
  const [users, setUsers] = useState({});
  const [blockedUsers, setBlockedUsers] = useState({});
  const [search, setSearch] = useState("");
  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "", role: "" });
  const [editingBalanceUser, setEditingBalanceUser] = useState(null);
  const [viewingTxUser, setViewingTxUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [adminNote, setAdminNote] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const ref = db.ref("users");
    ref.on("value", (snap) => setUsers(snap.val() || {}));
    return () => ref.off();
  }, []);

  useEffect(() => {
    const ref = db.ref("blocked_users");
    ref.on("value", (snap) => setBlockedUsers(snap.val() || {}));
    return () => ref.off();
  }, []);

  // Fetch transactions for a user
  const fetchTransactions = (uid) => {
    db.ref(`users/${uid}/transactions`)
      .limitToLast(30)
      .once("value", (snap) => {
        const txs = snap.val() ? Object.values(snap.val()) : [];
        setTransactions(txs.reverse());
      });
  };

  // Fetch admin note for a user
  const fetchAdminNote = (uid) => {
    db.ref(`users/${uid}/adminNote`).once("value", (snap) => {
      setAdminNote(snap.val() || "");
    });
  };

  const filtered = Object.entries(users).filter(
    ([uid, user]) =>
      uid.toLowerCase().includes(search.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase())) ||
      (user.name && user.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleEdit = (uid, user) => {
    setEditUserId(uid);
    setEditData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
    });
  };

  const handleSave = (uid) => {
    db.ref(`users/${uid}`).update(editData);
    setEditUserId(null);
    setMsg("User updated!");
    setTimeout(() => setMsg(""), 1500);
  };

  const handleBan = (uid) => {
    db.ref(`blocked_users/${uid}`).set(true);
    setMsg("User banned!");
    setTimeout(() => setMsg(""), 1500);
  };

  const handleUnban = (uid) => {
    db.ref(`blocked_users/${uid}`).remove();
    setMsg("User unbanned!");
    setTimeout(() => setMsg(""), 1500);
  };

  const handleDelete = (uid) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This cannot be undone."
      )
    ) {
      db.ref(`users/${uid}`).remove();
      db.ref(`blocked_users/${uid}`).remove();
      setMsg("User deleted!");
      setTimeout(() => setMsg(""), 1500);
    }
  };

  const handleResetPassword = async (email) => {
    if (!email) return alert("No email for this user.");
    try {
      await sendPasswordResetEmail(getAuth(), email);
      alert("Password reset email sent!");
    } catch (err) {
      alert("Failed to send reset email.");
    }
  };

  const handleViewTransactions = (uid) => {
    setViewingTxUser(uid);
    fetchTransactions(uid);
  };

  const handleSaveAdminNote = (uid) => {
    db.ref(`users/${uid}/adminNote`).set(adminNote);
    setMsg("Admin note saved!");
    setTimeout(() => setMsg(""), 1500);
  };

  const handleRoleChange = (uid, newRole) => {
    db.ref(`users/${uid}/role`).set(newRole);
    setMsg("Role updated!");
    setTimeout(() => setMsg(""), 1500);
  };

  const handleSendNotification = (uid) => {
    const note = prompt("Enter notification message to send to user:");
    if (note) {
      db.ref(`users/${uid}/notifications`).push({
        message: note,
        date: new Date().toISOString(),
        from: "admin",
      });
      setMsg("Notification sent!");
      setTimeout(() => setMsg(""), 1500);
    }
  };

  return (
    <div className="user-mgmt-container">
      <div className="user-mgmt-title">User Management</div>
      <input
        type="text"
        className="user-mgmt-search"
        placeholder="Search by name, email, or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="user-mgmt-table-wrapper">
        <table className="user-mgmt-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Balances</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
  {filtered.length === 0 && (
    <tr>
      <td colSpan={7} style={{ textAlign: "center", padding: 16 }}>
        No users found.
      </td>
    </tr>
            )}
            {filtered.map(([uid, user]) => (
              <tr
                key={uid}
                style={{ background: editUserId === uid ? "#e9f7ef" : "#fff" }}
              >
                <td title={uid}>
                  {uid.length > 12
                    ? uid.slice(0, 6) + "..." + uid.slice(-4)
                    : uid}
                </td>
                <td>
                  {editUserId === uid ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData((d) => ({ ...d, name: e.target.value }))
                      }
                    />
                  ) : (
                    user.name || "-"
                  )}
                </td>
                <td>
                  {editUserId === uid ? (
                    <input
                      type="text"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData((d) => ({ ...d, email: e.target.value }))
                      }
                    />
                  ) : (
                    user.email || "-"
                  )}
                </td>
                <td>
                  {editUserId === uid ? (
                    <input
                      type="text"
                      value={editData.role}
                      onChange={(e) =>
                        setEditData((d) => ({ ...d, role: e.target.value }))
                      }
                    />
                  ) : (
                    <>
                      <span>{user.role || "-"}</span>
                      <select
                        value={user.role || ""}
                        onChange={e => handleRoleChange(uid, e.target.value)}
                        style={{ marginLeft: 8 }}
                      >
                        <option value="">-</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="support">Support</option>
                      </select>
                    </>
                  )}
                </td>
                <td>
                  <span
                    className={`user-mgmt-status ${
                      blockedUsers[uid] ? "banned" : "active"
                    }`}
                  >
                    {blockedUsers[uid] ? "Banned" : "Active"}
                  </span>
                </td>
                <td>
  <button
    className="user-mgmt-action-btn balance"
    onClick={() => setEditingBalanceUser({ ...user, uid })}
  >
    Edit Balances
  </button>
  <div className="user-mgmt-balances-inline">
    {supportedCoins.map((c) => (
      <span key={c.symbol}>
        {c.symbol}: {user.balances?.[c.symbol] ?? 0}
      </span>
    ))}
  </div>
</td>
                <td>
                  {editUserId === uid ? (
                    <div className="user-mgmt-actions-stack">
                      <button
                        className="user-mgmt-action-btn save"
                        onClick={() => handleSave(uid)}
                      >
                        Save
                      </button>
                      <button
                        className="user-mgmt-action-btn cancel"
                        onClick={() => setEditUserId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="user-mgmt-actions-stack">
                      <button
                        className="user-mgmt-action-btn edit"
                        onClick={() => handleEdit(uid, user)}
                      >
                        Edit
                      </button>
                      {blockedUsers[uid] ? (
                        <button
                          className="user-mgmt-action-btn unban"
                          onClick={() => handleUnban(uid)}
                        >
                          Unban
                        </button>
                      ) : (
                        <button
                          className="user-mgmt-action-btn ban"
                          onClick={() => handleBan(uid)}
                        >
                          Ban
                        </button>
                      )}
                      <button
                        className="user-mgmt-action-btn delete"
                        onClick={() => handleDelete(uid)}
                      >
                        Delete
                      </button>
                      <button
                        className="user-mgmt-action-btn reset"
                        onClick={() => handleResetPassword(user.email)}
                      >
                        Reset Password
                      </button>
                      <button
                        className="user-mgmt-action-btn tx"
                        onClick={() => {
                          handleViewTransactions(uid);
                          fetchAdminNote(uid);
                        }}
                      >
                        View Tx/Note
                      </button>
                      <button
                        className="user-mgmt-action-btn notify"
                        onClick={() => handleSendNotification(uid)}
                      >
                        Notify
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editingBalanceUser && (
        <UserBalanceEditor
          user={editingBalanceUser}
          onClose={() => setEditingBalanceUser(null)}
        />
      )}
      {viewingTxUser && (
        <div className="user-tx-modal">
          <div className="user-tx-content">
            <h3>Recent Transactions</h3>
            <ul>
              {transactions.length === 0 && <li>No transactions found.</li>}
              {transactions.map((tx, i) => (
                <li key={i}>
                  <b>{tx.type}</b> {tx.amount} {tx.symbol} on{" "}
                  {tx.date ? new Date(tx.date).toLocaleString() : "-"}
                  {tx.note && <span> ({tx.note})</span>}
                </li>
              ))}
            </ul>
            <h4>Admin Note</h4>
            <textarea
              value={adminNote}
              onChange={e => setAdminNote(e.target.value)}
              rows={3}
              style={{ width: "100%" }}
            />
            <button onClick={() => handleSaveAdminNote(viewingTxUser)}>
              Save Note
            </button>
            <button onClick={() => setViewingTxUser(null)} style={{ marginLeft: 8 }}>
              Close
            </button>
          </div>
          <div className="user-tx-backdrop" onClick={() => setViewingTxUser(null)}></div>
        </div>
      )}
      {msg && <div className="user-mgmt-msg">{msg}</div>}
    </div>
  );
};

export default UserManagement;