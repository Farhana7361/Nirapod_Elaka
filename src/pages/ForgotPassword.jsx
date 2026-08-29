import React, { useState } from "react";
import { Link } from "react-router";
import { MapPin, Mail, Lock, ArrowLeft } from "lucide-react";
import axios from "axios";

export default function ForgotPassword() {
  
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  // check email exist
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await axios.post("http://localhost:5000/api/auth/check-email", {
        email,
      });
      setStep("reset");
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "We couldn't find an account with that email.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // submit  new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsLoading(true);

    try {
      // Assumes your backend has this endpoint
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        newPassword,
      });

      setMessage({
        type: "success",
        text: "Password updated! You can now log in.",
      });
      setStep("done");
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Something went wrong. Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brand}>
          <MapPin size={20} color="#f2a93b" strokeWidth={2.5} />
          <span style={styles.brandText}>Nirapod Elaka</span>
        </div>

        <h1 style={styles.title}>
          {step === "email" && "Reset Password"}
          {step === "reset" && "Set a New Password"}
          {step === "done" && "All Set"}
        </h1>
        <p style={styles.subtitle}>
          {step === "email" &&
            "Enter your email address and we'll check if you have an account."}
          {step === "reset" &&
            `Create a new password for ${email}.`}
          {step === "done" && "Your password has been updated."}
        </p>

        {/* email input */}
        {step === "email" && (
          <form onSubmit={handleCheckEmail}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="you@domain.com"
                required
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message.text && (
              <div
                style={{
                  color: message.type === "success" ? "#3ecf8e" : "#f87171",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                {message.text}
              </div>
            )}

            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? "Checking..." : "Continue"}
            </button>
          </form>
        )}

        {/* new password input */}
        {step === "reset" && (
          <form onSubmit={handleResetPassword}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>New Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                required
                style={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                required
                style={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {message.text && (
              <div
                style={{
                  color: message.type === "success" ? "#3ecf8e" : "#f87171",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                {message.text}
              </div>
            )}

            <button type="submit" style={styles.button} disabled={isLoading}>
              {isLoading ? "Saving..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* success  */}
        {step === "done" && (
          <div
            style={{
              color: "#3ecf8e",
              fontSize: "14px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {message.text}
          </div>
        )}

        <div style={styles.footer}>
          <Link to="/login" style={styles.backLink}>
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#10151f",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#171b26",
    border: "1px solid #2a3040",
    borderRadius: "22px",
    padding: "36px 32px 28px",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "28px",
  },
  brandText: { fontSize: "19px", fontWeight: "700", color: "#f3f4f6" },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#f3f4f6",
    margin: "0 0 6px",
  },
  subtitle: {
    color: "#9aa1b1",
    fontSize: "14px",
    margin: "0 0 26px",
    lineHeight: "1.5",
  },
  fieldGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#9aa1b1",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    background: "#12151f",
    border: "1px solid #2c3242",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#f3f4f6",
    fontSize: "15px",
    outline: "none",
  },
  button: {
    width: "100%",
    background: "#e6a94f",
    border: "none",
    borderRadius: "14px",
    padding: "15px",
    color: "#201404",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  footer: { marginTop: "22px", textAlign: "center" },
  backLink: {
    color: "#9aa1b1",
    textDecoration: "none",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};