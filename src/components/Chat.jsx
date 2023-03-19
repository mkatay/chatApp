import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import "../styles/Chat.css";
import { storage } from "../firebase-config";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
} from "@chatscope/chat-ui-kit-react";

export const Chat = ({ room, avatar }) => {
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  //meg kell mondani h melyik táblába tároljuk az üzeneteket,
  //ezért kell erre egy referenciát létrehozni
  const messagesRef = collection(db, "messages");

  useEffect(() => {
    const queryMsg = query(messagesRef, where("room", "==", room),orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMsg, (snapshot) => {
      //console.log('új üzenet...')
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    //amikor megtörtént az adatok lekérdezése, meg kell szüntetni a kapcsolatot az erőforrással
    return () => unsubscribe(); //clean up useEffect
  }, []);

  const handleSubmit = async (e) => {
    console.log(e.target.parentNode.tagName,avatar);
    if (
      e.target.parentNode.tagName == "BUTTON" ||
      e.target.parentNode.tagName == "svg"
    ) {
      if (newMsg === "") return;
      let url=""
      if(avatar){
        const imageRef = ref(storage, "images/" + auth.currentUser.displayName);
        await uploadBytes(imageRef, avatar);
        url = await getDownloadURL(imageRef);
      }
      await addDoc(messagesRef, {
        text: newMsg,
        createdAt: serverTimestamp(),
        user: auth.currentUser.displayName,
        avatar: url,
        room, //ha a kulcs neve megegyezik a változó nevével így is lehet
      });
      setNewMsg("");
    }
  };
  return (
    <div className="chat-app">
      <div className="header">
        <h3>Üdv! - szoba: {room.toUpperCase()}</h3>
      </div>
      <div style={{ position: "relative", height: "500px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList>
              {messages.map((msg) => (
                <Message
                  key={msg.id}
                  model={{
                    message: "<b>" + msg.user + "</b><br>" + msg.text,
                    sentTime: "just now",
                    sender: msg.user,
                    avatar: msg.avatar,
                  }}
                >
                  <Avatar
                    src={msg?.avatar ? msg.avatar : "user.png"}
                    name={msg.user}
                    size="md"
                  />
                </Message>
              ))}
            </MessageList>
            <MessageInput
              placeholder="Type message here"
              onInput={(e) => setNewMsg(e.target.innerHTML)}
              onClick={handleSubmit}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};
