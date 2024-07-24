"use client";

import ChatWindow from "@/components/ChatWindow";
import MessageWindow from "@/components/MessageWindow";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import socketio from "socket.io-client";
import msgpackParser from "socket.io-msgpack-parser";
import { IS_DEV, WS_ENDPOINT } from "./../constant/config";

const promptName = () => {
  const name = prompt("Enter Your Name");
  if (!name || name?.length < 2) {
    alert("Name must be at least two characters long");
    return promptName();
  }
  return name;
};
export default function Chat() {
  const textInputFocused = useRef(false);
  const chatWindowDiv = useRef(null);
  const socket = useRef(null);
  const [messages, setMessages] = useState([]);
  const params = useParams();
  useEffect(() => {
    socket.current = socketio.connect(WS_ENDPOINT, {
      parser: IS_DEV ? undefined : msgpackParser,
      transports: ["websocket", "polling"],
      query: {
        now: Date.now(),
      },
    });
    const connectionHandler = (socket) => () => {
      console.log("App.jsx: Socket.io initiated at:", +new Date());
      const cachedName = localStorage.getItem("name");
      const name = cachedName || promptName();
      if (!cachedName) localStorage.setItem("name", name);
      socket.current.emit("init", { name, roomId: params.id });
      socket.current.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
        const isOwnMessage = message.userId === socket.current.id;
        if (!textInputFocused.current && !isOwnMessage) return;
        setTimeout(() => {
          chatWindowDiv.current.scrollTo(0, 999999999999999);
        }, 50);
      });
    };
    const disconnectHandler = (socket) => () => {
      console.log("disconnected");
      socket.current.removeAllListeners();
      socket.current.on("connect", connectionHandler(socket));
      socket.current.on("disconnect", disconnectHandler(socket));
    };
    socket.current.on("connect", connectionHandler(socket));
    socket.current.on("disconnect", disconnectHandler(socket));
    return () => {
      socket.current.disconnect();
      socket.current.removeAllListeners();
    };
  }, [params.id]);
  return (
    <section className="container max-w-3xl mx-auto h-full rounded bg-zinc-800 flex flex-col justify-between">
      <div className="px-4 py-2 text-white flex items-center gap-x-1">
        <p className="bg-green-600 w-2 h-2 rounded-full"></p>
        <p>123 Members online</p>
      </div>
      <ChatWindow
        messages={messages}
        socket={socket}
        chatWindowDiv={chatWindowDiv}
      />
      <MessageWindow textInputFocused={textInputFocused} socket={socket} />
    </section>
  );
}
