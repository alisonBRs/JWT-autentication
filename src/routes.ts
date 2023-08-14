import { Router } from "express";
import { RouteType } from "./interfaces/route-type.routes";
import { userControllers } from "./controllers/user-controllers";
import { userLogin } from "./controllers/login-controller";

export class User implements RouteType {
  path = "/";
  router = Router();

  constructor() {
    this.router.get("/", userControllers.getUser);
    this.router.post("/", userControllers.postUser);
    this.router.delete("/:id", userControllers.deleteUser);
    this.router.post("/login", userLogin.login);
    this.router.get("/profile", userLogin.getProfile);
  }
}
