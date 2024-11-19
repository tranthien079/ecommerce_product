import { useSelector } from "react-redux";
import { useContext } from "react";
import UserChat from "../components/chat/UserChat";
import ChatBox from "../components/chat/ChatBox";
import { ChatContext } from "../context/ChatContext";
import PotentialChats from "../components/chat/PotentialChats";
import React from 'react';
import Meta from "../components/Meta";
const Chat = () => {
  const userState = useSelector((state) => state?.auth?.user);
  const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);

  return (
    <>
      <Meta title="Tin nhắn" />
     <div className="container mx-auto">
      <PotentialChats />
      {/* <h2 className="text-center text-xl font-bold text-gray-800 my-4">
        Nhắn tin với nhân viên
      </h2> */}
      {userChats?.length < 0 ? null : (
        <div className="flex gap-4 bg-gray-900 p-4 rounded-lg ">
          <div className="flex-grow-0 overflow-y-auto pr-3 space-y-3 w-1/4 h-[70vh]">
            {isUserChatsLoading && <p className="text-white">Loading...</p>}
            {userChats?.map((chat, index) => (
              <div key={index} onClick={() => updateCurrentChat(chat)}>
                <UserChat chat={chat} user={userState} />
              </div>
            ))}
          </div>
          <div className="flex-grow bg-gray-800 p-4 rounded-lg w-3/4">
            <ChatBox />
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Chat;