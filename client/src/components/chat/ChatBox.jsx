import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ChatContext } from "../../context/ChatContext";
import { useGetRecepientUser } from "../../hooks/useGetRecepient";
import { DateTime } from "luxon";
import InputEmoji from "react-input-emoji";

const ChatBox = () => {
  const userState = useSelector((state) => state?.auth?.user);
  const { currentChat, messages, isMessagesLoading, sendTextMessage } = useContext(ChatContext);

  const { recipientUser } = useGetRecepientUser({
    chat: currentChat,
    user: userState,
  });

  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef(null); // Create a single ref for scrolling

  // Scroll to the last message when messages update
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipientUser)
    return <p className="text-center w-full mt-4 text-white">No conversation selected yet...</p>;

  if (isMessagesLoading) {
    return <p className="text-center w-full">LOADING....</p>;
  }

  return (
    <div className="flex flex-col gap-4 w-full chat-box max-h-[70vh]">
      <div className="chat-header font-bold text-center">
        {recipientUser?.firstname} {recipientUser?.lastname}
      </div>
      <div className="messages flex flex-col gap-3 overflow-y-auto h-[70vh]">
        {messages.map((message, index) => {
          const isLastMessage = index === messages.length - 1; 

          return (
            <div
              key={index}
              className={`${
                message?.senderId === userState?._id
                  ? "message self bg-[#00bd9b] self-end text-white rounded-lg p-2"
                  : "message bg-gray-300  self-start  text-black rounded-lg p-2"
              } max-w-xs`}
              ref={isLastMessage ? scroll : null} 
            >
              <span>{message?.text}</span>
              <span className="message-footer text-xs text-gray-900 block">
                {DateTime.fromISO(message?.createdAt)
                  .setLocale("vi")
                  .toRelative({ base: DateTime.now() })}
              </span>
            </div>
          );
        })}
      </div>
      <div className="chat-input flex items-center gap-3">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="Poppins"
          borderColor="rgba(72, 112, 223, 0.2)"
          className="w-full"
        />

        <button
          className="send-btn p-2 bg-blue-500 text-white rounded-full"
          onClick={() =>
            sendTextMessage(textMessage, userState, currentChat?._id, setTextMessage)
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
