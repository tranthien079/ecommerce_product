import { createContext, useState, useEffect, useCallback } from "react";
import { base_url, server_url } from "../utils/base_url";
import axios from "axios";
import { io } from "socket.io-client";
export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  // initital connection websocket
  useEffect(() => {
    if (!user?._id) return; // Make sure user._id is available
    const newSocket = io(server_url);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      newSocket.emit("addNewUser", user._id);
      newSocket.on("getOnlineUsers", (res) => {
        setOnlineUsers(res);
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // send new message
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // receive message and notifications
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setMessages((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  // useEffect(() => {
  //   const newSocket = io(server_url);
  //   setSocket(newSocket);

  //   return () => {
  //     newSocket.disconnect();
  //   }
  // }, [user])

  // useEffect(() => {
  //   if(socket === null) return;
  //   socket.emit("addNewUser", user?._id)
  // }, [socket])

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get(`${base_url}user`);

      const pChats = response?.data?.filter((u) => {
        let isChatCreated = false;

        if (user?._id == u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }

        return !isChatCreated;
      });
      setPotentialChats(pChats);
      setAllUsers(response?.data);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await axios.get(`${base_url}chats/${user?._id}`);
        setIsUserChatsLoading(false);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response?.data);
      }
    };
    getUserChats();
  }, [user, notifications]);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return console.log("You must some thing...");

      const response = await axios.post(`${base_url}messages/`, {
        chatId: currentChatId,
        senderId: sender?._id,
        text: textMessage,
      });

      setNewMessage(response?.data);

      setMessages((prev) => [...prev, response?.data]);

      setTextMessage("");
    },
    []
  );

  const updateCurrentChat = useCallback(async (chat) => {
    setCurrentChat(chat);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);

      const response = await axios.get(
        `${base_url}messages/${currentChat?._id}`
      );

      setIsMessagesLoading(false);

      setMessages(response?.data);
    };
    getMessages();
  }, [currentChat]);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await axios.post(`${base_url}chats/`, {
      firstId,
      secondId,
    });

    setUserChats((prev) => [...prev, response.data]);
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });
    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      // find chat to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });

      // mark notificaion as read
      const mNotifications = notifications.map((el) => {
        if (n.senderId == el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });
      updateCurrentChat(desiredChat);
      setNotifications(mNotifications);
    },
    []
  );

  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      // mark notificaion as read
      const mNotifications = notifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId == el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });

        return notification;
      });
      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        currentChat,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
