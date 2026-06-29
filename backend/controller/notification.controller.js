import Notification from "../model/notification.model.js";

export const getNotification = async (req, res) => {
    try {
        const userId = req.user._id;
        const notifications = await Notification.find({to : userId}).populate({
            path: "from",
            select: "username profileImg"
        }).sort({createdAt: -1})

        await Notification.updateMany({to: userId}, {seen: true})

        return res.status(200).json(notifications)
    } catch (error) {
        console.log("Error in getNotification: ", error)
        return res.status(500).json({message: "Internal server error"})
    }
}

export const deleteNotification = async (req, res)=>{
    try {
        const userId = req.user._id;
        await Notification.deleteMany({to: userId});
        return res.status(200).json({message: "All notifications deleted successfully"})
    } catch (error) {
        console.log("Error in deleteNotification: ", error)
        return res.status(500).json({message: "Internal server error"})
    }

}

export const deleteSingleNotification = async (req, res)=>{
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;

        const notification = await Notification.findOne({_id: notificationId, to: userId});
        if(!notification){
            return res.status(404).json({message: "Notification not found"})
        }

        await Notification.deleteOne({_id: notificationId, to: userId});
        return res.status(200).json({message: "Notification deleted successfully"})
    } catch (error) {
        console.log("Error in deleteSingleNotification: ", error)
        return res.status(500).json({message: "Internal server error"})
    }
}