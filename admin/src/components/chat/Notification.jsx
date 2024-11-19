import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { useSelector } from "react-redux";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import { DateTime } from "luxon";
import { Link } from 'react-router-dom';
import React from "react";
const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userState = useSelector((state) => state?.auth?.user);
  const {
    notifications,
    userChats,
    allUsers,
    markAllNotificationsAsRead,
    markNotificationAsRead,
  } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);

  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find((user) => user?._id === n.senderId);
    return {
      ...n,
      senderName: sender?.firstname + " " + sender?.lastname,
    };
  });
  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };
  return (
    <div className="relative z-[100]">
      <div
        className="relative cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadNotifications?.length === 0 ? null : (
          <span className="absolute top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
            {unreadNotifications?.length}
          </span>
        )}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 text-white rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h3 className="text-lg text-white">Thông báo <br />
            </h3>
            <button
              className="text-sm hover:underline"
              onClick={() => markAllNotificationsAsRead(notifications)}
            >
              Đánh dấu đã đọc
            </button>
          </div>
          <div className="p-2 max-h-96 overflow-y-auto">
            {modifiedNotifications?.length === 0 ? (
              <span className="block text-center text-gray-400">
                Không có tin nhắn...
              </span>
            ) : (
              modifiedNotifications.map((n, index) => (
                <div
                  key={index}
                  className={`rounded-lg cursor-pointer ${
                    n.isRead ? "bg-gray-700" : "bg-blue-500"
                  }`}
                  onClick={() => {
                    markNotificationAsRead(
                      n,
                      userChats,
                      userState,
                      notifications
                    );
                    setIsOpen(false);
                  }}
                >
                  <span className="">{`${truncateText(n.senderName, 12)} send a new message`}</span>
                  <span className="mb-1 block text-sm text-gray-700">
                    {DateTime.fromISO(n.date).setLocale("vi").toRelative()}
                  </span>
                </div>
              ))
            )}
          </div>
          {/* <Link className="m-0" to='/sale/chat'>Đi đến trang chat</Link> */}

        </div>
      )}
    </div>
  );
};

export default Notification;
