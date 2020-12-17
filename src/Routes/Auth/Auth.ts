import { Router } from "express";
import authController from "../../Controller/Auth/Auth";

const router = Router();
const AuthController = new authController();

router.post("/api/user-signup/:user_role", (request, response) => {
  AuthController.SignUp(request, response);
});

router.post("/api/user-signin", (request, response) => {
  AuthController.SignIn(request, response);
});

router.get("/api/logout", (request, response) => {
  AuthController.LogOut(request, response);
});

router.get("/api/isLoggedIn", (request, response) => {
  AuthController.isLoggedIn(request, response);
});

export default router;
