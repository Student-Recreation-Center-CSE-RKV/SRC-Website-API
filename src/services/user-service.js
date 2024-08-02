const { UserRepository } = require("../repository/index");
const { sendVerificationEmail } = require("../utils/sendmail");
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../config/serverConfig");
const ValidationError = require("../utils/errors/validation-error");
const AppErrors = require("../utils/errors/error-handler");
const ClientError = require("../utils/errors/client-error");
const { StatusCodes } = require("http-status-codes");

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(data) {
    try {
      const isExists = await this.getUserByEmail(data.email);
      if (!isExists) {
        const newUser = await this.userRepository.create(data);
        const verificationToken = newUser.genJWT();
        await sendVerificationEmail(data.email, verificationToken, "verify"); //'verify' to identify type of mail to send
        return { message: "Verification link sent to your email" };
      } else if (isExists.isVerified) {
        throw new ClientError(
          "User Already Exists",
          "Try with another Email",
          "User already exists",
          StatusCodes.BAD_REQUEST
        );
      } else {
        throw {
          message: "Verification email already sent.Please verify your email.",
        };
      }
    } catch (error) {
      if (error.name == "ValidationError") {
        throw new ValidationError(error);
      }
      throw error;
    }
  }
  async getUserByEmail(email) {
    console.log("getting email:", email);
    try {
      return await this.userRepository.findBy({ email });
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(token) {
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      const user = await this.userRepository.get(decoded._id);
      if (!user) throw new Error("User not found");

      if (user.isVerified == true) {
        throw new Error("User already verified");
      }
      user.isVerified = true;
      await user.save();
      return user;
    } catch (error) {
      if (error.message == "User already verified") {
        throw new Error("User already verified");
      }
      if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired");
      } else {
        throw new Error("Invalid token");
      }
    }
  }

  async signin(data) {
    try {
      const user = await this.getUserByEmail(data.email);
      if (!user) {
        throw { message: "No user found" };
      }
      if (!user.comparePassword(data.password)) {
        throw { message: "Wrong password" };
      }
      if (!user.isVerified) {
        throw { message: "Email not verified,verification link sent already" };
      }
      const token = user.genJWT();
      return token;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(userId, role) {
    try {
      const response = await this.userRepository.update(userId, role);

      return response;
    } catch (error) {
      throw error;
    }
  }

  async updateDetails(userId, data) {
    try {
      console.log("in user service", userId, data);
      const response = await this.userRepository.update(userId, data);
      return response;
    } catch (error) {
      throw error;
    }
  }
  async sendResetLink(email) {
    console.log("reset link:", email);
    try {
      const isExists = await this.getUserByEmail(email);
      console.log("reset link isExists:", isExists);
      if (isExists && isExists.isVerified) {
        const flag = "link";
        const token = isExists.genJWT();
        await sendVerificationEmail(email, token, flag);
        return { message: "Password Reset link sent to your email" };
      } else {
        throw { message: "No User Exists ,Email is not registered/verified" };
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async resetPassword(token, new_password) {
    try {
      const decoded = jwt.verify(token, JWT_KEY);
      const user = await this.userRepository.get(decoded._id);
      if (!user) throw new Error("User not found");
      user.password = new_password;
      await user.save();
      return user;
    } catch (error) {
      // if(error.message=='User already verified'){
      //     throw new Error('User already verified');
      // }
      // if (error.name === 'TokenExpiredError') {
      //     throw new Error('Token has expired');
      // } else {
      //     throw new Error('Invalid token');
      // }
      throw error;
    }
  }
}

module.exports = UserService;
