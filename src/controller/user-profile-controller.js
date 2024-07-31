const UserProfileService = require("../services/user-profile-service"); // Importing as instance, not a class
const { StatusCodes } = require("http-status-codes");
const userProfileService = new UserProfileService();
const fs = require("fs");
const multer = require("multer");
class UserProfileController {
  async getAllUserProfiles(req, res) {
    try {
      const profiles = await userProfileService.getAllUserProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserProfileById(req, res) {
    try {
      const profile = await userProfileService.getUserProfileById(
        req.params.id
      );
      if (!profile)
        return res.status(404).json({ message: "UserProfile not found" });
      res.status(200).json(profile);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  async getUserProfileByEmail(req, res, next) {
    try {
      const email = req.params.email;
      console.log("user profile controller:", email);
      const user = await userProfileService.getUserProfileByEmail(email);
      console.log("user profile schema controller:", user);
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ message: "User not found" });
      }
      res.status(StatusCodes.OK).json(user);
    } catch (error) {
      next(error);
    }
  }
  async createUserProfile(req, res) {
    try {
      const profile = await userProfileService.createUserProfile(req.body);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateUserProfile(req, res) {
    console.log("in profile controller:", req.params.id, req.body);
    try {
      const profileData = req.body;
      console.log("Req file", req.file);
      if (req.file) {
        const filePath = req.file.path;
        // Read file and convert to Base64
        const fileBuffer = fs.readFileSync(filePath);
        const fileBase64 = fileBuffer.toString("base64");

        // Add the Base64 image to newsData
        profileData.image = fileBase64;

        // Delete the file after converting to Base64
        fs.unlinkSync(filePath);
      }
      const profile = await userProfileService.updateUserProfile(
        req.params.id,
        profileData
      );
      console.log("in profile controller user:", profile);

      if (!profile)
        return res.status(404).json({ message: "UserProfile not found" });
      res.status(200).json(profile);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteUserProfile(req, res) {
    try {
      const profile = await userProfileService.deleteUserProfile(req.params.id);
      if (!profile)
        return res.status(404).json({ message: "UserProfile not found" });
      res.status(200).json({ message: "UserProfile deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserProfileController();
