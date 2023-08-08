import { Router } from "express";
import { RouteType } from "./interfaces/route-type.routes";
import { userControllers } from "./controllers/user-controllers";

export class User implements RouteType {
  path = "/";
  router = Router();

  constructor() {
    this.router.get("/", userControllers.getUser);
    this.router.post("/", userControllers.postUser);
    this.router.delete("/:id", userControllers.deleteUser);
  }
}
