import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const ChatBar = ({ socket, roomID }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on("newUserResponse", (data) => {
      setUsers(data.filter((user) => user.roomID === roomID));
    });

    return () => {
      socket.off("newUserResponse");
    };
  }, [socket, roomID]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Active Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.socketID}
        renderItem={({ item }) => <Text style={styles.user}>{item.userID}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
    minWidth: 150,
  },
  header: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  user: {
    fontSize: 14,
    paddingVertical: 2,
  },
});

export default ChatBar;
