import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Contact.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [message, setMessage] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Use environment variables for sensitive data
  const TELEGRAM_BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.REACT_APP_TELEGRAM_CHAT_ID;

  const sendMessageToTelegram = async (text) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const payload = {
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "Markdown",
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to send message");
      return true;
    } catch (error) {
      console.error("Telegram send error:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !mobile || !message) {
      setStatusMsg("Please fill all fields.");
      return;
    }

    setLoading(true);
    setStatusMsg("");

    // Compose message with markdown icons
    const text =
      `👤 *Name:* ${name}\n` +
      `✉️ *Email:* ${email}\n` +
      `📞 *Contact:* ${mobile}\n` +
      `💬 *Message:* ${message}`;

    const success = await sendMessageToTelegram(text);

    if (success) {
      setStatusMsg("Your message has been sent successfully!");
      setName("");
      setEmail("");
      setMobile("");
      setMessage("");
    } else {
      setStatusMsg("Failed to send message. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <main className="contact-container">
        <h1>Contact Us</h1>
        <p>Please fill out the form below and send your message.</p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
            />
          </label>

          <label>
            Mobile Number:
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile number"
              pattern="[0-9]{10}"
              required
            />
          </label>

          <label>
            Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here"
              rows={5}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {statusMsg && <p className="status-msg">{statusMsg}</p>}
        </form>
      </main>
    </>
  );
}
