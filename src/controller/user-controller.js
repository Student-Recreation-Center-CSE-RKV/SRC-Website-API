const { UserService, UserProfileService } = require("../services/index");
const userService = new UserService();
const userProfileService = new UserProfileService();

const { StatusCodes } = require("http-status-codes");

// User signup controller
const signup = async (req, res) => {
  try {
    const user = await userService.signup({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role,
    });
    return res.status(201).json({
      success: true,
      data: user,
      message: "Successfully created a new user",
      err: {},
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      data: {},
      message: error.message,
      err: error.name,
    });
  }
};

const getUserByEmail = async (req, res, next) => {
  try {
    const email = req.params.email;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

// User login controller
const login = async (req, res) => {
  try {
    const token = await userService.signin(req.body);
    // const user = await userService.getUserByEmail(req.body.email).populate('userProfile');
    const user = await userService.getUserByEmail(req.body.email);

    return res.status(200).json({
      success: true,
      data: {
        token,
        user,
      },
      message: "Successfully logged in",
      err: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: "Something went wrong",
      err: error.message,
    });
  }
};

// Update Role

const updateRole = async (req, res) => {
  try {
    const response = await userService.updateRole(req.params.id, req.body);
    return res.status(201).json({
      success: true,
      err: {},
      data: response,
      message: "Successfully updated the Role",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {},
      err: error.message,
    });
  }
};

const verify = async (req, res) => {
  try {
    const token = req.params.token;
    const response = await userService.verifyUser(token);
    console.log("RES:s", response);
    if (response.isVerified) {
      const userProfile = await userProfileService.createUserProfile({
        name: response.name,
        email: response.email,
        userId: response._id,
      });
      console.log("Profile:", userProfile);
    }

    return res.status(201).json({
      success: true,
      err: {},
      data: response,
      message: response.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {},
      err: error.message,
    });
  }
};

const passwordResetLink = async (req, res) => {
  try {
    const response = await userService.sendResetLink(req.params.email);
    return res.status(201).json({
      success: true,
      err: {},
      data: response,
      message: response.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {},
      err: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const password = req.body.password;
    const response = await userService.resetPassword(
      req.params.token,
      password
    );
    return res.status(201).json({
      success: true,
      err: {},
      data: response,
      message: response.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {},
      err: error.message,
    });
  }
};
const updateDetails = async (req, res) => {
  try {
    const userData = req.body;
    console.log("user data in controller", req.params.token, userData);
    const response = await userService.updateDetails(
      req.params.token,
      userData
    );
    return res.status(201).json({
      success: true,
      err: {},
      data: response,
      message: response.message,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      data: {},
      err: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
  verify,
  passwordResetLink,
  updatePassword,
  getUserByEmail,
  updateDetails,
  updateRole,
  getUserByEmail,
};
