import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import io from "socket.io-client";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";
import { useSocket } from "../../Store/SocketContext";

const ChatPage = () => {
  const route = useRoute();
  const { roomID } = route.params;  // Get room ID from navigation
  const [messages, setMessages] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const lastMessageRef = useRef(null);
  const { socket, isConnected } = useSocket();
console.log("socketsss id",socket.id)
  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages((prev) => [...prev, data]));
    socket.on("typingResponse", (data) => setTypingStatus(data));

    return () => {
      socket.off("messageResponse");
      socket.off("typingResponse");
    };
  }, []);

  return (
    <View style={styles.container}>
      <ChatBar socket={socket} roomID={roomID} />
      <ScrollView ref={lastMessageRef} style={styles.chatMain}>
        <ChatBody messages={messages} typingStatus={typingStatus} lastMessageRef={lastMessageRef} roomID={roomID} socket={socket} />
      </ScrollView>
      <ChatFooter socket={socket} roomID={roomID} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  chatMain: { flex: 1, paddingBottom: 20 },
});

export default ChatPage;
