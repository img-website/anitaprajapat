"use client";

import { useState } from "react";
import api from "@/services/apiClient";
import PhoneField from "./PhoneField";
import styles from "./ContactForm.module.scss";

const initial = {
  name: "",
  phone: "",
  email: "",
  city: "",
  eventType: "",
  eventDate: "",
  type: "booking",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const update = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", msg: "" });
    try {
      await api.post("/contact", form);
      setStatus({ state: "success", msg: "Thank you! Your inquiry has been received. We'll be in touch soon." });
      setForm(initial);
    } catch (err) {
      setStatus({
        state: "error",
        msg: err.data?.message || "Something went wrong. Please try WhatsApp instead.",
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <div className={styles.row}>
        <label>
          Name *
          <input name="name" value={form.name} onChange={update} required minLength={2} />
        </label>
        <label>
          Phone *
          <PhoneField
            value={form.phone}
            onChange={(val) => setForm((f) => ({ ...f, phone: val }))}
            required
          />
        </label>
      </div>

      <div className={styles.row}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={update} />
        </label>
        <label>
          City
          <input name="city" value={form.city} onChange={update} />
        </label>
      </div>

      <div className={styles.row}>
        <label>
          Inquiry Type
          <select name="type" value={form.type} onChange={update}>
            <option value="booking">Booking / Jagran</option>
            <option value="general">General</option>
            <option value="media">Media / Press</option>
          </select>
        </label>
        <label>
          Event Date
          <input type="date" name="eventDate" value={form.eventDate} onChange={update} />
        </label>
      </div>

      <label>
        Message *
        <textarea name="message" rows={5} value={form.message} onChange={update} required minLength={5} />
      </label>

      {status.state !== "idle" && status.msg && (
        <p
          className={`${styles.alert} ${styles[status.state]}`}
          role={status.state === "error" ? "alert" : "status"}
          aria-live={status.state === "error" ? "assertive" : "polite"}
        >
          {status.msg}
        </p>
      )}

      <button type="submit" className="btn btn-gold" disabled={status.state === "loading"}>
        {status.state === "loading" ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
