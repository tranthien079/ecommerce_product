const Message = require('../models/messageModel');

// create message
const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    const newMessage = new Message({
        chatId,
        senderId,
        text
    })

    try {
        const response = await newMessage.save();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getMessages = async (req, res) => {
    const {chatId} = req.params;
    try {
        const messages = await Message.find({ chatId: chatId });
        console.log(messages)
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = {
    createMessage,
    getMessages
}