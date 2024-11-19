import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useSelector } from "react-redux";

const PotentialChats = () => {
  const userState = useSelector((state) => state?.auth?.user);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <div className="space-y-2">
      {potentialChats.length > 0 &&
        potentialChats?.map((u, index) => {
          const isOnline = onlineUsers?.some((user) => user?.userId === u?._id);
          return (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => createChat(userState?._id, u?._id)}
            >
              <span>
                {u?.firstname} {u?.lastname}
              </span>
              {isOnline && (
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default PotentialChats;
