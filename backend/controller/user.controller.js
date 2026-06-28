import { v2 as cloudinary } from "cloudinary";

import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error in the getUserProfile controller : ${error.message}`);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const followUnfollowUser = async (req, res) => {
  try {
    console.log("entered controller");
    const { id } = req.params;
    const targetUser = await User.findById(id);
    const loggedInUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "you cannot follow / unfollow yourself" });
    }

    if (!targetUser || !loggedInUser) {
      return res.status(404).json({ message: "user not found" });
    }

    const isFollowing = loggedInUser.following.some(
      (userId) => userId.toString() === id,
    );
    if (isFollowing) {
      //unfollow to user
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

      return res.status(200).json({ message: "user unfollowed successfullly" });
    } else {
      //follow the user
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      //send notification to the use
      const newNotification = new Notification({
        type: "follow",
        from: req.user._id,
        to: targetUser._id,
      });
      await newNotification.save();
      return res.status(200).json({ message: "user followed successfully" });
    }
  } catch (error) {
    console.log(`Error in the followUnfollow controller : ${error.message}`);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const userFollowedbyloggedInUser =
      await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: {
            $ne: userId,
          },
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) =>
        !userFollowedbyloggedInUser.following.some(
          (id) => id.toString() === user._id.toString(),
        ),
    );
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    return res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log(`Error in the suggestedUser controller: ${error.message}`);
    return res.status(500).json("internal server error");
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const {
      userName,
      fullName,
      email,
      currentPassword,
      newPassword,
      bio,
      link,
    } = req.body;

    let { profileImg, coverImg } = req.body;

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        message: "please provide both current and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "current password does not match",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: "password length must be greater than 6",
        });
      }

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0],
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg);

      profileImg = uploadedResponse.secure_url;
    }

    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0],
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg);

      coverImg = uploadedResponse.secure_url;
    }

    user.fullname = fullName || user.fullname;

    user.email = email || user.email;

    user.username = userName || user.username;

    user.bio = bio || user.bio;

    user.link = link || user.link;

    user.profileImg = profileImg || user.profileImg;

    user.coverImg = coverImg || user.coverImg;

    await user.save();

    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.log(`Error in updateUserProfile controller: ${error.message}`);

    return res.status(500).json({
      message: "internal server error",
    });
  }
};
