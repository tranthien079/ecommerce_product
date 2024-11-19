import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findUser } from "../redux/user/userSlice";
import axios from "axios";
import { base_url } from "../utils/base_url";

export const useGetRecepientUser = ({ chat, user }) => {
  const [recipientUser, setRecipientUser] = useState(null);

  const recipientId = chat?.members?.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
        if (!recipientId) return null;

        const response = await axios.get(`${base_url}user/find/${recipientId}`);

        setRecipientUser(response?.data);

    };

    getUser();
  }, [recipientId]);


  return { recipientUser };
};
