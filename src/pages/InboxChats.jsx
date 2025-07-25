import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { auth, db } from "../FireBase/firebaseConfig";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, onSnapshot, or } from "firebase/firestore";
import { useUnreadMessages } from "../context/unreadMessageContext";

function InboxChats() {
  const navigate = useNavigate();
  const { setTotalUnreadCount } = useUnreadMessages();
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
const [loading, setLoading] = useState(true);

  const getUserNameById = async (userId) => {
  try {
    console.log(`Fetching user name for userId: ${userId}`);
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log(`User data for ${userId}:`, userData);
      return userData.cli_name || "Unknown User"; 
    }
    console.log(`No user document found for ${userId}`);
    return "Unknown User";
  } catch (err) {
    console.error(`Error fetching user name for ${userId}:`, err);
    return "Unknown User";
  }
};

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserEmail(user.email);
        setCurrentUserId(user.uid);
        console.log('Current User ID:', user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const q = query(
      collection(db, 'messages'),
      or(
        where('sender_id', '==', currentUserId),
        where('receiver_id', '==', currentUserId)
      )
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      console.log('Raw messages:', snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      const conversationsMap = {};

      for (const msg of snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))) {
        const otherUserId =
          msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
        let otherUserName =
          msg.sender_id === currentUserId
            ? msg.reciverName || (await getUserNameById(msg.receiver_id))
            : await getUserNameById(msg.sender_id);

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
          (conversationsMap[otherUserId].timestamp?.toMillis() || 0)
        ) {
          conversationsMap[otherUserId].lastMessage = msg.content;
          conversationsMap[otherUserId].timestamp = msg.timestamp;
        }

        if (msg.receiver_id === currentUserId && !msg.is_read) {
          conversationsMap[otherUserId].unreadCount += 1;
        }
      }

      const sorted = Object.values(conversationsMap).sort(
        (a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)
      );
      setChats(sorted);
      setFilteredChats(sorted);
      const totalUnread = sorted.reduce((sum, chat) => sum + chat.unreadCount, 0);
      setTotalUnreadCount(totalUnread);
       setLoading(false); 
    }, (err) => {
      console.error('Error fetching conversations:', err);
       setLoading(false); 
    });

    return () => unsubscribe();
  }, [currentUserId, setTotalUnreadCount]);

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
        <Avatar alt="User" sx={{ width: 56, height: 56 }}>
          {currentUserEmail?.split("@")[0].split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase() || "User"}
        </Avatar>
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

      {loading ? (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 9 }}>
    <CircularProgress/>
  </Box>
) : filteredChats.length === 0 ? (
  <Typography
    sx={{
      textAlign: 'center',
      mt: 4,
      fontSize: '18px',
      color: 'gray',
      fontWeight: 'bold',
    }}
  >
    لا توجد محادثات بعد
  </Typography>
) :
      filteredChats.map((chat) => (
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
                  backgroundColor: "#6E00FE",
                  color: "white",
                  width: '24px',
                  height: '24px',
                  borderRadius: "50%",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: 1,
                  fontSize: "14px",
                  fontWeight: 'bold',
                  lineHeight: 1,
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