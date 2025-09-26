import React, { useEffect, useState } from "react";
import { 
    View, Text, FlatList, StyleSheet, Alert, TouchableOpacity 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const ChatBody = ({ messages, typingStatus, roomID, socket }) => {
    const navigation = useNavigation();
    const [countDown, setCountDown] = useState(null);
    const [countDownWarning, setCountDownWarning] = useState(false);
    const [isCallEnded, setIsCallEnded] = useState(false);
    const [callMessage, setCallMessage] = useState("You cannot join the chat at this time.");
    const [loggedInUser, setLoggedInUser] = useState(null);

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const storedUserName = await AsyncStorage.getItem("userName");
                if (storedUserName) {
                    setLoggedInUser(storedUserName.trim().toLowerCase()); // Normalize
                }
            } catch (error) {
                console.log("Error retrieving user name:", error);
            }
        };
    
        fetchUserName();
    }, []);

    const handleDisconnect = () => {
        socket.disconnect();
        navigation.goBack();
    };

    useEffect(() => {
        if (countDown === 0) {
            handleDisconnect();
            setIsCallEnded(true);
        }
    }, [countDown]);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
    };

    return (
        <SafeAreaView style={styles.safeContainer}>
            {/* Header Section */}
            <View style={styles.header}>
            {!isCallEnded && (
                <TouchableOpacity style={styles.leaveButton} onPress={handleDisconnect}>
                    <Text style={styles.leaveButtonText}>End Chat</Text>
                </TouchableOpacity>
            )}
                <Text style={styles.headerText}>Doctor Card Here</Text>
                {countDown !== null && !isCallEnded ? (
                    <View>
                        <Text style={styles.timerTitle}>Time Remaining:</Text>
                        <Text style={[styles.timer, { color: countDownWarning ? "red" : "black" }]}>
                            {formatTime(countDown)}
                        </Text>
                    </View>
                ) : isCallEnded ? (
                    <Text style={styles.endedText}>The call has ended.</Text>
                ) : (
                    <Text>{callMessage}</Text>
                )}
            </View>

            {/* Message Container */}
            {loggedInUser && (
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                // renderItem={({ item }) => {
                //     console.log("Message Name:", item.name, "Logged In User:", loggedInUser); // Debugging log
                //     const isSender = item.name.trim().toLowerCase() === loggedInUser;

                //     return (
                //         <View style={[styles.messageContainer, isSender ? styles.messageSender : styles.messageRecipient]}>
                //             <Text style={[styles.messageText, isSender ? styles.senderText : styles.recipientText]}>
                //                 {item.text}
                //             </Text>
                //         </View>
                //     );
                // }}
                renderItem={({ item }) => {
                    const isSender = item.socketID === socket.id;
                
                    return (
                        <View style={[
                            styles.messageContainer, 
                            isSender ? styles.messageRecipient : styles.messageSender // Flip here
                        ]}>
                            <Text style={[
                                styles.messageText, 
                                isSender ? styles.recipientText : styles.senderText // Flip here
                            ]}>
                                {item.text}
                            </Text>
                        </View>
                    );
                }}
                
            />
        )}

            {/* Typing Status */}
            {typingStatus ? <Text style={styles.typingStatus}>{typingStatus}</Text> : null}

            {/* Leave Chat Button */}
         
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        alignItems: "center",
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    headerText: {
        fontSize: 18,
        fontWeight: "bold",
    },
    timerTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 5,
    },
    timer: {
        fontSize: 18,
        fontWeight: "bold",
    },
    endedText: {
        fontSize: 16,
        color: "red",
        fontWeight: "bold",
    },
    messageContainer: {
        maxWidth: "80%",
        padding: 10,
        marginVertical: 5,
        borderRadius: 8,
    },
    messageSender: {
        alignSelf: "flex-start",
        backgroundColor: "#E72B4A",
        borderTopRightRadius: 0, // Gives a chat bubble effect
    },
    messageRecipient: {
        alignSelf: "flex-end",
        backgroundColor: "#E1E1E1",
        borderTopLeftRadius: 0, // Gives a chat bubble effect
    },
    messageText: {
        fontSize: 16,
    },
    senderText: {
        color: "white",
    },
    recipientText: {
        color: "black",
    },
    typingStatus: {
        fontStyle: "italic",
        color: "gray",
        textAlign: "center",
        marginBottom: 5,
    },
    leaveButton: {
        marginTop: 10,
        backgroundColor: "red",
        padding: 10,
        alignItems: "center",
        borderRadius: 8,
    },
    leaveButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default ChatBody;
