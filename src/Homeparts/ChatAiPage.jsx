import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const ChatAiPage = () => {
  const [chats, setChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(-1);
  const [input, setInput] = useState("");

  const model = "gpt-4o-mini";
  const API_TOKEN = import.meta.env.VITE_AI_API_TOKEN;

  const addNewChat = () => {
    const newChat = {
      title: chats.length === 0 ? "محادثة واحدة" : `محادثة ${chats.length + 1}`,
      messages: [],
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setCurrentChatIndex(0);
  };

  useEffect(() => {
    if (chats.length === 0) {
      addNewChat();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || currentChatIndex === -1) return;

    const updatedChats = [...chats];
    const currentMessages = updatedChats[currentChatIndex].messages;

    const lastUserMessage = [...currentMessages].reverse().find(m => m.sender === "user");
    if (lastUserMessage && lastUserMessage.text.trim() === input.trim()) {
      return;
    }

    currentMessages.push({ text: input, sender: "user" });

    if (currentMessages.length === 1) {
      const newTitle = input.split(" ").slice(0, 5).join(" ");
      updatedChats[currentChatIndex].title = newTitle;
    }

    setChats([...updatedChats]);
    setInput("");

    try {
      const formattedMessages = currentMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          max_tokens: 100, // ✅ تقصير الرد
        }),
      });

      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "لا يوجد رد من الذكاء الاصطناعي.";

      currentMessages.push({ text: botReply, sender: "bot" });
      setChats([...updatedChats]);
    } catch (error) {
      currentMessages.push({ text: "⚠️ حدث خطأ أثناء محاولة الحصول على رد.", sender: "bot" });
      setChats([...updatedChats]);
    }
  };

  return (
    <Box display="flex" flexDirection="row-reverse" height="90dvh" sx={{ direction: "rtl", overflow: "hidden",
    //  pt:8 
     }}>
      
      {/* Sidebar */}
      <Box
        width={{ xs: "100px", sm: "250px", md: "300px" }}
        minWidth={{ xs: "100px", sm: "250px", md: "300px" }}
        bgcolor="#6E00FE"
        color="white"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{ mb: 2, bgcolor: "white", color: "#6E00FE", fontWeight: "bold" }}
          onClick={addNewChat}
        >
          + محادثة جديدة
        </Button>

        <List sx={{ flexGrow: 1, overflowY: "auto" }}>
          {chats.map((chat, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton
                selected={index === currentChatIndex}
                onClick={() => setCurrentChatIndex(index)}
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: index === currentChatIndex ? "#5a00cc" : "inherit",
                  color: "white",
                }}
              >
                <ListItemText
                  primary={chat.title}
                  sx={{
                    backgroundColor: "#4c00b0",
                    borderRadius: "10px",
                    padding: "12px",
                    textAlign: "center",
                    width: "100%",
                    minHeight: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Main Chat Area */}
      <Box flexGrow={1} display="flex" flexDirection="column" p={2} height="100%">
        <Paper
          elevation={3}
          sx={{
            flexGrow: 1,
            p: 2,
            mb: 2,
            overflowY: "auto",
          }}
        >
          {currentChatIndex === -1 ? (
            <Typography>لم يتم تحديد محادثة. ابدأ محادثة جديدة!</Typography>
          ) : chats[currentChatIndex].messages.length === 0 ? (
            <Typography>ابدأ الحديث بكتابة رسالة أدناه!</Typography>
          ) : (
            chats[currentChatIndex].messages.map((msg, i) => (
              <Box
                key={i}
                textAlign={msg.sender === "user" ? "right" : "left"}
                mb={1}
              >
                <Box
                  component="span"
                  sx={{
                    display: "inline-block",
                    px: 2,
                    py: 1,
                    maxWidth: "80%", // ✅ تمنع تمدد الرسالة
                    bgcolor: msg.sender === "user" ? "#6E00FE" : "#ddd",
                    color: msg.sender === "user" ? "white" : "black",
                    direction: "rtl",
                    textAlign: "right",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    borderBottomLeftRadius: msg.sender === "user" ? 16 : 0,
                    borderBottomRightRadius: msg.sender === "user" ? 0 : 16,
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.text}
                </Box>
              </Box>
            ))
          )}
        </Paper>

        {/* Input Form */}
        <Box component="form" onSubmit={handleSubmit} display="flex" gap={2}>
          <TextField
            fullWidth
            placeholder="اكتب رسالتك..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            size="small"
            inputProps={{ dir: "rtl", style: { textAlign: "right" } }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: "#6E00FE", color: "white", whiteSpace: "nowrap" }}
          >
            إرسال
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatAiPage;
