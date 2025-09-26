import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const ChatFooter = ({ socket, roomID }) => {
  const [message, setMessage] = useState("");

  const handleTyping = () => {
    socket.emit("typing", { roomID, data: "User is typing..." });
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit("message", {
        roomID,
        data: { text: message, name: "User", id: `${socket.id}${Math.random()}`, socketID: socket.id },
      });
      setMessage("");
    }
  };

  return (
    <View style={styles.footer}>
      <TextInput
        style={styles.input}
        placeholder="Write a message..."
        value={message}
        onChangeText={setMessage}
        onKeyPress={handleTyping}
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatFooter;
