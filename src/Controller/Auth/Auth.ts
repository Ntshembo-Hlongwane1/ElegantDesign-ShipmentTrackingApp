import { IncomingForm, Fields } from "formidable";
import { userModel } from "../../Model/Users/Users";
import { sessionModel } from "../../Model/userSessions/Session";
import Bcrypt from "bcrypt";
import { Request, Response } from "express";

interface Auth {
  SignUp(request: Request, response: Response): Response;
  SignIn(request: Request, response: Response): Response;
  LogOut(request: Request, response: Response): Response;
  isLoggedIn(request: Request, response: Response): Response;
}

export default class AuthController implements Auth {
  SignUp(request: Request, response: Response) {
    const form = new IncomingForm();

    const user_role = request.params.user_role;
    try {
      form.parse(request, async (error, fields: Fields) => {
        if (error) {
          return response.status(500).json({
            msg: "Network Error: Failed to sign user up try agin later",
          });
        }

        const { username, password, email } = fields;

        if (!username || !password || !email) {
          return response
            .status(400)
            .json({ msg: "All fields are required to SignUp" });
        }

        if (password.length < 6) {
          return response
            .status(400)
            .json({ msg: "Password has to be at least 6 characters long" });
        }

        const isUsernameExisting = await userModel.findOne({
          username: username,
        });

        if (isUsernameExisting) {
          return response
            .status(400)
            .json({ msg: "Account with this username already exist" });
        }

        const isEmailExisting = await userModel.findOne({ email: email });

        if (isEmailExisting) {
          return response
            .status(400)
            .json({ msg: "Account with this email already exist " });
        }

        const salt = await Bcrypt.genSalt(15);
        const hashedPassword = await Bcrypt.hash(password, salt);

        const newUser = new userModel({
          username: username,
          email: email,
          password: hashedPassword,
          role: user_role,
        });

        const savedUser = newUser.save();

        return response
          .status(201)
          .json({ msg: "Account has been created successfully login" });
      });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to SignUp user try again later" });
    }
  }

  SignIn(request: Request, response: Response) {
    const form = new IncomingForm();

    try {
      form.parse(request, async (error, fields: Fields) => {
        if (error) {
          return response.status(500).json({
            msg: "Network Error: Failed to SignIn user try again later",
          });
        }

        const { username, password } = fields;

        if (!username || !password) {
          return response
            .status(400)
            .json({ msg: "All fields are required to SignIn" });
        }

        const user: any | string = await userModel.findOne({
          username: username,
        });

        if (!username) {
          return response
            .status(404)
            .json({ msg: "Account with this username does not exist" });
        }

        const hashedPassword = user.password;
        const isPasswordValid = await Bcrypt.compare(password, hashedPassword);

        if (!isPasswordValid) {
          return response.status(400).json({ msg: "Invalid Crendentials" });
        }

        const isUserSessionActive = await sessionModel.findOne({
          "session.user._id": user._id,
        });

        if (isUserSessionActive) {
          return response.status(200).json({ msg: "Already Signed in" });
        }

        const userSessionObj = {
          _id: user._id,
          username: user.username,
          email: user.email,
          user_role: user.role,
        };

        request.session.user = userSessionObj;
        response.status(200).send(request.sessionID);
      });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to SignIn user try again later" });
    }
  }

  LogOut(request: Request, response: Response) {
    const userSession = request.session.user;
    try {
      if (userSession) {
        request.session.destroy();
        return response.status(200).json({ msg: "Logged Out" });
      }
      return response.status(400).json({ msg: "Account is not logged in" });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to SignIn user try again later" });
    }
  }

  isLoggedIn(request: Request, response: Response) {
    const userSession = request.session.user;

    try {
      if (!userSession) {
        return response.status(200).json({ auth_status: false });
      }

      return response
        .status(200)
        .json({
          auth_status: true,
          user_role: userSession.user_role,
          username: userSession.username,
        });
    } catch (error) {
      return response
        .status(500)
        .json({ msg: "Network Error: Failed to SignIn user try again later" });
    }
  }
}
