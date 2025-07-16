import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setName(authUser.displayName || "");
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const validatePassword = (pwd) => {
    const strong = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    setPasswordValid(strong.test(pwd));
  };

  const handleUpdateName = async () => {
    try {
      await updateProfile(user, { displayName: name });
      toast.success("Name updated successfully.");
    } catch {
      toast.error("Failed to update name.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword)
      return toast.error("Please fill both current and new password.");
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(error.message || "Failed to change password.");
    }
  };

  return (
    <div className="profile-wrapper">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <div className="profile-card animated-fade">
        <h2>My Profile</h2>

        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleUpdateName} className="yellow-btn">Update Name</button>

        <label>Email:</label>
        <input type="email" value={user?.email || ""} disabled />

        <label>Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
        />

        <label>New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            validatePassword(e.target.value);
          }}
          placeholder="Enter new password"
        />
        <p className={`password-check ${passwordValid ? "valid" : "invalid"}`}>
          {passwordValid ? "✅ Strong password" : "❌ At least 8 chars, 1 uppercase, 1 number"}
        </p>

        <button
          onClick={handleChangePassword}
          className="yellow-btn"
          disabled={!passwordValid}
        >
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
