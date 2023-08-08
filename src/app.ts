import express from "express";
import cors from "cors";
import { RouteType } from "./interfaces/route-type.routes";

export class App {
  app: express.Application = express();

  constructor({ path, router }: RouteType) {
    this.middlewares();
    this.initRoute({ path, router });
  }

  public middlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  public initRoute({ path, router }: RouteType) {
    this.app.use(path, router);
  }

  public listen(port: number, message: string) {
    this.app.listen(port, () => console.log(message));
  }
}
