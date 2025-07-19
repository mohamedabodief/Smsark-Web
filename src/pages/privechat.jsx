import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { db, auth } from "../FireBase/firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useLocation, useNavigate } from "react-router-dom";

function ChatBox() {
  const location = useLocation();
  const navigate = useNavigate();
  const otherUser = location.state?.otherUser;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const bottomRef = useRef();

  // تأكيد وجود المستخدم الآخر
  if (!otherUser) {
    return (
      <Box sx={{ mt: "100px", textAlign: "center", direction: "rtl" }}>
        <Typography variant="h6">⚠️ لا يوجد مستخدم محدد</Typography>
        <Button variant="contained" onClick={() => navigate(-1)}>
          عودة
        </Button>
      </Box>
    );
  }

  // تسجيل المستخدم الحالي
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // جلب الرسائل بين المستخدمين
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "messages"),
      where("sender_id", "in", [currentUser.uid, otherUser.userId]),
      where("receiver_id", "in", [currentUser.uid, otherUser.userId]),
      orderBy("timestamp")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMsgs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter(
          (msg) =>
            (msg.sender_id === currentUser.uid &&
              msg.receiver_id === otherUser.userId) ||
            (msg.sender_id === otherUser.userId &&
              msg.receiver_id === currentUser.uid)
        );
      setMessages(allMsgs);
    });

    return () => unsubscribe();
  }, [currentUser, otherUser.userId]);

  // تمرير الشاشة لآخر رسالة
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // إرسال رسالة
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, "messages"), {
        sender_id: currentUser.uid,
        receiver_id: otherUser.userId,
        content: newMessage,
        reciverName: otherUser.userName || "مستخدم غير معروف", // إضافة reciverName
        is_read: false,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (err) {
      console.error("خطأ في إرسال الرسالة:", err);
    }
  };

  return (
    <Box sx={{ mt: "100px", mx: "auto", maxWidth: 600 }} dir="rtl">
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        🔙 عودة للمحادثات
      </Button>

      <Typography variant="h6" sx={{ mb: 2 }}>
        المحادثة مع: {otherUser.userName || "مستخدم غير معروف"}
      </Typography>

      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          my: 2,
          background: "#f9f9f9",
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: "flex",
              justifyContent:
                msg.sender_id === currentUser?.uid ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  msg.sender_id === currentUser?.uid ? "#4DBD43" : "#e0e0e0",
                color: msg.sender_id === currentUser?.uid ? "white" : "black",
                px: 2,
                py: 1,
                borderRadius: "10px",
                maxWidth: "70%",
              }}
            >
              {msg.content}
            </Box>
          </Box>
        ))}
        <div ref={bottomRef} />
      </Box>

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="اكتب رسالتك..."
        />
        <Button variant="contained" onClick={handleSend}>
          إرسال
        </Button>
      </Box>
    </Box>
  );
}

export default ChatBox;