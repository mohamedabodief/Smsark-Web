import {
  Avatar,
  Box,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth } from "../FireBase/firebaseConfig";
import SearchIcon from "@mui/icons-material/Search";
import Message from "../FireBase/MessageAndNotification/Message";
import { useNavigate } from "react-router-dom";
import { db } from "../FireBase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function InboxChats() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Fetch user name by ID from users collection (optional)
  const getUserNameById = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().name || "Unknown User"; // Adjust 'name' to your users collection field
      }
      return "Unknown User";
    } catch (err) {
      console.error("Error fetching user name:", err);
      return "Unknown User";
    }
  };

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
      const conversationsMap = {};

      try {
        const allMessages = await Message.getAllMessagesForUser(currentUserId);
        const unreadMessages = await Message.getUnreadMessages(currentUserId);

        for (const msg of allMessages) {
          const otherUserId =
            msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;

          // Determine the display name
          let otherUserName;
          if (msg.sender_id === currentUserId) {
            otherUserName = msg.reciverName || "Unknown User"; // Use reciverName if sender
          } else {
            otherUserName = await getUserNameById(msg.sender_id); // Fetch sender name if receiver
          }

          if (!conversationsMap[otherUserId]) {
            conversationsMap[otherUserId] = {
              userId: otherUserId,
              userName: otherUserName,
              lastMessage: msg.content,
              timestamp: msg.timestamp,
              unreadCount: 0,
            };
          }

          if (
            msg.timestamp?.toMillis() >
            conversationsMap[otherUserId].timestamp?.toMillis()
          ) {
            conversationsMap[otherUserId].lastMessage = msg.content;
            conversationsMap[otherUserId].timestamp = msg.timestamp;
          }
        }

        for (const unreadMsg of unreadMessages) {
          const otherUserId =
            unreadMsg.sender_id === currentUserId
              ? unreadMsg.receiver_id
              : unreadMsg.sender_id;

          let otherUserName;
          if (unreadMsg.sender_id === currentUserId) {
            otherUserName = unreadMsg.reciverName || "Unknown User";
            console.log("المستخدم الآخر:", otherUserId, "الاسم:", otherUserName);
          } else {
            otherUserName = await getUserNameById(unreadMsg.sender_id);
          }

          if (conversationsMap[otherUserId]) {
            conversationsMap[otherUserId].unreadCount += 1;
          } else {
            conversationsMap[otherUserId] = {
              userId: otherUserId,
              userName: otherUserName,
              lastMessage: unreadMsg.content,
              timestamp: unreadMsg.timestamp,
              unreadCount: 1,
            };
          }
        }

        const sorted = Object.values(conversationsMap).sort(
          (a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()
        );
        setChats(sorted);
        setFilteredChats(sorted);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchChats();
  }, [currentUserId]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredChats(chats);
    } else {
      const filtered = chats.filter((chat) =>
        chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchQuery, chats]);
const getAvatarColor = (name) => {
  const colors = [
    "#4DBD43",
    "#3F51B5", 
    "#F44336",
    "#FF9800", 
    "#9C27B0", 
    "#00BCD4", 
    "#795548",
  ];
  const firstChar = name?.[0]?.toUpperCase() || "A";
  const index = firstChar.charCodeAt(0) % colors.length;
  return colors[index];
};
  return (
    <Container maxWidth="md" dir="rtl">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
          mt: "100px",
          alignItems: "center",
        }}
      >
        <Avatar alt="User" sx={{ width: 56, height: 56 }} >{currentUserEmail?.split("@")[0].split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "User"}</Avatar>
        <Typography sx={{ fontSize: "20px", fontWeight: 600 }}>
          {currentUserEmail?.split("@")[0] || "User"}
        </Typography>
      </Box>

      <Box sx={{ mt: "20px" }}>
        <TextField
          variant="outlined"
          placeholder="ابحث هنا"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      {filteredChats.map((chat) => (
        <Box
          key={chat.userId}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mt: 2,
            justifyContent: "space-between",
            borderBottom: "1px solid #eee",
            pb: 1,
            cursor: "pointer",
          }}
         onClick={() =>
            navigate(`/privateChat/${chat.userId}`, {
              state: { otherUser: { userId: chat.userId, userName: chat.userName } },
            })
          }
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Avatar sx={{ bgcolor: getAvatarColor(chat.userName), color: "white" }}>
  {chat.userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()}
</Avatar>

            <Box>
              <Typography sx={{ fontWeight: "bold" }}>
                {chat.userName}
              </Typography>
              <Typography sx={{ color: "gray" }}>{chat.lastMessage}</Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography
              sx={{
                fontSize: "12px",
                color: "gray",
                ml: 1,
                minWidth: "70px",
              }}
            >
              {chat.timestamp
                ? new Date(chat.timestamp.toMillis()).toLocaleTimeString(
                    "ar-EG",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )
                : ""}
            </Typography>

            {chat.unreadCount > 0 && (
              <Typography
                sx={{
                  backgroundColor: "#4DBD43",
                  color: "white",
                  px: 2,
                  borderRadius: "50px",
                  mt: 1,
                  fontSize: "12px",
                }}
              >
                {chat.unreadCount}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Container>
  );
}

export default InboxChats;