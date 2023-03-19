import "./App.css";
import React, { useState } from "react";
import { Auth } from "./components/Auth";
import Cookies from "universal-cookie";
import { useRef } from "react";
import { Chat } from "./components/Chat";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import { Button } from "@chatscope/chat-ui-kit-react";
import { resizeFile } from "./components/utils";

const cookies = new Cookies(); //to set and get cookies from the browser

function App() {
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token")); //true vagy false lesz
  const [avatar, setAvatar] = useState("");
  const [room, setRoom] = useState(null);
  const roomInputRef = useRef(null);

  const handleSignOut = async () => {
    await signOut(auth);
    cookies.remove('auth-token');
    setIsAuth(false);
    setRoom(null);
  };
  const handleChange = async (e) => {
    try {
      let file = e.target.files[0];
      if (file) {
        const image = await resizeFile(file);
        console.log(image);
        setAvatar(image);
      }
    } catch (err) {
      console.log(err);
    }
  };
  if (!isAuth) {
    return (
      <div className="App">
        <Auth setIsAuth={setIsAuth} />
      </div>
    );
  }
  return (
    <div className="App">
      {room ? (
        <div>
          <Chat room={room} avatar={avatar} />
        </div>
      ) : (
        <div className="room">
          <div>Enter the room name:</div>
          <input type="text" ref={roomInputRef} />
          <input type="file" onChange={handleChange} />
          <Button border onClick={() => setRoom(roomInputRef.current.value)}>
            Enter Chat
          </Button>
        </div>
      )}

      <Button border onClick={handleSignOut}>
        sign out
      </Button>
    </div>
  );
}

export default App;
