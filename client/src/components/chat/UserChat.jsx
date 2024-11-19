import { useContext } from "react";
import { useGetRecepientUser } from "../../hooks/useGetRecepient";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { useGetLatestMessage } from "../../hooks/useGetLatestMessage";
import { DateTime } from "luxon";
import avatar from "../../assets/avatar1.png";
import React from 'react';
const UserChat = ({ chat, user }) => {
  const { recipientUser } = useGetRecepientUser({ chat, user });
  const { onlineUsers, notifications, markThisUserNotificationAsRead } =
    useContext(ChatContext);
  const { latestMessage } = useGetLatestMessage(chat);
  const unreadNotifications = unreadNotificationsFunc(notifications);
  const thisUserNotifications = unreadNotifications?.filter(
    (n) => n.senderId == recipientUser?._id
  );
  const isOnline = onlineUsers?.some(
    (user) => user?.userId == recipientUser?._id
  );

  const truncateText = (text) => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) {
      shortText += "...";
    }
    return shortText;
  };

  return (
    <div
      className="flex items-center justify-between p-2 cursor-pointer text-white  hover:bg-gray-300 "
      onClick={() => {
        if (thisUserNotifications?.length !== 0) {
          markThisUserNotificationAsRead(thisUserNotifications, notifications);
        }
      }}
    >
      <div className="flex items-center">
        <div className="mr-2 relative">
          <img
            src={recipientUser?.avatar == "" ? recipientUser?.avatar : avatar}
            alt="User Avatar"
            className="h-9 w-9 rounded-full"
          />
        {isOnline && <div className="w-3 h-3 rounded-full bg-green-500 absolute top-0 right-0"></div>}

        </div>
        <div className="text-content">
          <div className="font-bold  hover:text-orange-400!important ">
            {recipientUser?.firstname + " " + recipientUser?.lastname || "Unknown User"}
          </div>
          <div className="text-md text-gray-500">
            {latestMessage?.text ? (
              <span>{truncateText(latestMessage?.text)}</span>
            ) : (
              "Chưa có tin nhắn"
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <div className="text-xs text-gray-500">
          {DateTime.fromISO(latestMessage?.createdAt).setLocale("vi").toRelative()}
        </div>
        {thisUserNotifications?.length > 0 && (
          <div className="inline-flex items-center justify-center w-5 h-5 text-xs text-white font-bold bg-red-500 rounded-full">
            {thisUserNotifications?.length}
          </div>
        )}
        
      </div>
    </div>
  );
};

export default UserChat;
