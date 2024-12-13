import adminMesasge from "../model/adminMessage.js"

export const addMessage = async (req , res) => {
    const data =  req.body
    try {
        await adminMesasge.create({
            type : data.type,
            role : data.role,
            message : data.message,
            username : data.username,
            userId : data.userId,
        })
        res.status(201).json({message: "Message added successfully"})
    }catch (e) {
        console.log(e.message)
        res.send({message:e.message})
    }
}

export const getMessages = async (req , res) => {
    try{
        const userId = req.params.id
        const findResult = await adminMesasge.find( { 
            userId : userId
        })
        res.status(200).json({message: "found", result : findResult})
    }catch (e){
        res.send({message: "error"})
    }
}

export const deleteMessage = async (req, res) => {
    try{
        const messageId = req.params.id
        const deleteMessage = await adminMesasge.findByIdAndDelete(messageId)
        if (!deleteMessage) {
            return res.status(404).json({ message: "Message not found" });
        }
        res.status(200).json({ message: "Message request deleted successfully" });
    }catch(e) {
        console.log(e.message)
        s.status(500).json({ message: "Error deleting message", error: e.message });
    }
}


export const getReplies = async (req, res) => {
    try {
        const findResult = await adminMesasge.find({
            type : "reply"
        })
        res.send({result : findResult})
    }catch (e) {
        res.send({result : "error"})
    }
}