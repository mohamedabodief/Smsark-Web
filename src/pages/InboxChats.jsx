import {
  Avatar,
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth } from "../FireBase/firebaseConfig";
import SearchIcon from "@mui/icons-material/Search";
import Message from "../FireBase/MessageAndNotification/Message";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../FireBase/firebaseConfig";
import { useNavigate } from "react-router-dom";
function InboxChats() {
    const navagate=useNavigate()
  const [chats, setChats] = useState([]);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserEmail(user.email);
        setCurrentUserId(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!currentUserId) return;

   const fetchChats = async () => {
  const conversations = {};

  try {
    const allMessages = await Message.getAllMessagesInvolvingUser(currentUserId);
    console.log("📥 الرسائل المسترجعة:", allMessages);

    for (const msg of allMessages) {
      const isSender = msg.sender_id === currentUserId;
      const otherUser = isSender ? msg.receiver_id : msg.sender_id;

      if (!conversations[otherUser]) {
        // جلب اسم المستخدم الحقيقي من Firestore
        const userDoc = await getDoc(doc(db, "users", otherUser));
        const userName = userDoc.exists()
          ? userDoc.data().user_name || "مستخدم"
          : "مستخدم";

        conversations[otherUser] = {
          userId: otherUser,
          userName,
          lastMessage: msg.content,
          timestamp: msg.timestamp,
          unreadCount: 0,
        };
      }

      // تحديث آخر رسالة
      if (
        msg.timestamp?.toMillis() >
        conversations[otherUser].timestamp?.toMillis()
      ) {
        conversations[otherUser].lastMessage = msg.content;
        conversations[otherUser].timestamp = msg.timestamp;
      }

      // تحديث عدد الرسائل غير المقروءة
      if (!msg.is_read && msg.receiver_id === currentUserId) {
        conversations[otherUser].unreadCount += 1;
      }
    }

    // بعد الانتهاء من كل شيء
    setChats(Object.values(conversations));
  } catch (error) {
    console.error("فشل تحميل الرسائل:", error);
  }
};


    fetchChats();
  }, [currentUserId]);

  return (
    <Container maxWidth="md" dir="rtl">
      {/* بيانات المستخدم */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          mt: "100px",
          alignItems: "center",
        }}
      >
        <Avatar alt="Remy Sharp" sx={{ width: 56, height: 56 }} />
        <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
         {currentUserEmail?.split("@")[0]}
        </Typography>
      </Box>

      {/* مربع البحث */}
      <Box sx={{ mt: "20px" }}>
        <TextField
          variant="outlined"
          placeholder="ابحث هنا"
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* عرض المحادثات */}
      <Box sx={{ mt: 3 }}>
        {chats.length === 0 && (
          <Typography sx={{ textAlign: "center", color: "gray" }}>
            لا توجد محادثات
          </Typography>
        )}

        {chats.map((chat) => (
            <Button sx={{display:'block',width:'100%'}} onClick={()=>{
               navagate('/privateChat',{ state: { otherUser: chat } }) 
            }}>
          <Box
          
            key={chat.userId}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid #ccc",
              paddingY: 2,
              marginTop:'10px',
              padding:'10px',
           
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar />
              <Box>
                <Typography sx={{ fontWeight: "bold" }}>
                 {chat.userName}
                </Typography>
                <Typography sx={{ color: "gray" }}>
                   {chat.lastMessage} 
                </Typography>
              </Box>
            </Box>

            {chat.unreadCount > 0 && (
              <Typography
                sx={{
                  backgroundColor: "#4DBD43",
                  color: "white",
                  px: 2,
                  borderRadius: "50px",
                }}
              >
                {chat.unreadCount}
              </Typography>
            )}
            
          </Box>
          </Button>
        ))}
      </Box>
    </Container>
  );
}

export default InboxChats;