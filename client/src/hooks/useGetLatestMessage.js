import { useContext, useEffect, useState } from "react"
import { ChatContext } from "../context/ChatContext"
import axios from "axios";
import { base_url } from "../utils/base_url";

export const useGetLatestMessage = (chat) => {
    const { newMessage, notifications } = useContext(ChatContext);
    const [latestMessage, setLatestMessage] = useState(null);

    useEffect(() => {
        const getMessages = async () => {
            const response = await axios.get(`${base_url}messages/${chat?._id}`);

            const result = response?.data;

            const lastMessage = result[result.length - 1];

            setLatestMessage(lastMessage);
        }
        getMessages();
    }, [newMessage, notifications])
    return { latestMessage };
}