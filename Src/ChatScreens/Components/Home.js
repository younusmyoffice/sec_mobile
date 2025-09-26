import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSocket } from "../../Store/SocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Home = () => {
    const { socket, isConnected } = useSocket();
    const navigation = useNavigation();
    const route = useRoute();
    const [appointmentId,setappointmentId]=("");
    const [userName, setUserName] = useState("");
    const [roomID, setRoomID] = useState("");



    useEffect(() => {
        if (route.params?.roomID || route.params?.userID) {
            setRoomID(route.params.roomID);
            setUserName(route.params.userID);
            console.log("routes states",route.params)
            // setappointmentId(route.params.appiontmentId)
        }
    }, [route.params]);  // Runs when route params change
    
    useEffect(() => {
        // Load username from AsyncStorage
        console.log("routes",route.params.roomID,route.params.userID)
        

        const loadUserName = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem("userName");
                if (storedUserName) {
                    setUserName(storedUserName); // Set stored username if exists
                }
            } catch (error) {
                console.log("Failed to load username:", error);
            }
        };
        loadUserName();

        if (socket) {
            socket.on("roomJoined", (data) => {
                console.log("✅ Joined Room:", data);
            });

            socket.on("messageResponse", (data) => {
                console.log("📩 New message:", data);
            });

            return () => {
                socket.off("roomJoined");
                socket.off("messageResponse");
            };
        }
    }, [socket]);

    const handleSubmit = async () => {
        console.log("roomId is not comming :",roomID)
        if (!userName.trim() || !roomID) {
            Alert.alert("Error", "Both Username and Room ID are required.");
            return;
        }

        try {
            await AsyncStorage.setItem("userName", userName); // Save username in AsyncStorage
        } catch (error) {
            console.log("Failed to save username:", error);
        }

        if (socket) {
            socket.emit("joinRoom", { userID: userName, roomID, doctorId: "", appointment_id:route?.params?.appointmentId });
            navigation.navigate("ChatsScreenChatMain", { roomID });
            // console.log("checking my socket id",socket)
        } else {
            Alert.alert("Error", "Socket connection is not established.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Join Chat Room</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Your Name"
                value={userName}
                onChangeText={setUserName}
            />
            {/* <TextInput
                style={styles.input}
                placeholder={roomID ? roomID : "Enter Room ID"}
                value={roomID}
                onChangeText={setRoomID}
                keyboardType="numeric"
            /> */}
            <Text>{roomID}</Text>
            <Button title={isConnected ? "Join" : "Connecting..."} onPress={handleSubmit} disabled={!isConnected} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },
});

export default Home;
