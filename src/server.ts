import { App } from "./app";
import { User } from "./routes";

const port: number = 3005;
const url: string = `http://localhost:${port}`;
const message: string = `Server running at url port: ${url}`;

const app = new App(new User());

app.listen(port, message);
