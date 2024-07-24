"use client";

import { useRef, useState } from "react";

import { WS_ENDPOINT } from "../constant/config";
import { useParams } from "next/navigation";

let shiftKeyDown = false;

export default function MessageWindow({ textInputFocused, socket }) {
  const fileInput = useRef(null);
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState("");
  const params = useParams();

  return (
    <div className="w-full p-4 text-white flex flex-col justify-center gap-y-2 overflow-hidden">
      <form
        className="w-full flex gap-x-2"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.append("file", file);
          formData.append("name", localStorage.getItem("name"));
          formData.append("roomId", params.id);
          formData.append("userId", socket.current.id);
          e.target.files = null;

          fetch(WS_ENDPOINT + "/upload", {
            method: "POST",
            body: formData,
            mode: "no-cors",
          })
            .then(() => {
              setTimeout(() => {
                window.scrollTo(0, 9999999999);
              }, 100);
            })
            .catch(console.error);
        }}
      >
        <input
          type="file"
          className="border border-gray-500 p-1 w-full rounded-md"
          ref={fileInput}
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <button
          type="submit"
          className="transition px-4 py-1 border border-gray-500 w-36 rounded-md hover:bg-black"
        >
          Send File
        </button>
      </form>
      <div className="w-full flex gap-x-2">
        <input
          type="text"
          placeholder="Type message.."
          className="bg-zinc-700 w-full rounded-md p-2 focus:outline-none"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
          }}
          onFocus={() => {
            textInputFocused.current = true;
          }}
          onBlur={() => {
            textInputFocused.current = false;
          }}
          onKeyDown={(e) => {
            if (e.key === "Shift") {
              shiftKeyDown = true;
            }
            if (e.key === "Enter" && !shiftKeyDown) {
              if (!messageInput) return;
              socket.current.emit("message", { message: messageInput });
              setMessageInput("");
            }
          }}
          onKeyUp={(e) => {
            if (e.key !== "Shift") return;
            shiftKeyDown = false;
          }}
        ></input>
        <button
          onClick={() => {
            if (!messageInput) return;
            socket.current.emit("message", { message: messageInput });
            setMessageInput("");
          }}
          className="transition px-4 py-1 border border-gray-500 rounded-md hover:bg-black"
        >
          Send
        </button>
      </div>
    </div>
  );
}
