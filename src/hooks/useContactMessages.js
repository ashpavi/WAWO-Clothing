import { useEffect, useState } from "react";

import {
  markContactMessageRead,
  subscribeContactMessages,
  deleteContactMessage
} from "../firebase/services/messageService";

export const useContactMessages = () => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const unsubscribe = subscribeContactMessages(

      (data) => {
        setMessages(data);
        setLoading(false);
      },

      (err) => {
        setError(err.message || "Failed to load messages");
        setLoading(false);
      }

    );

    return unsubscribe;

  }, []);

  /* ================= MARK AS READ ================= */

  const setRead = async (id) => {
    try {
      await markContactMessageRead(id);
    } catch (err) {
      console.error("Mark as read failed:", err);
    }
  };

  /* ================= DELETE MESSAGE ================= */

  const removeMessage = async (id) => {
    try {
      await deleteContactMessage(id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return {
    messages,
    loading,
    error,
    setRead,
    removeMessage, 
  };
};