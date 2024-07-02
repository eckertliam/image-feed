import { config } from "dotenv";
import app from "./app";
import path from "node:path";
import registerController from "./controllers/register.controller";
import loginController from "./controllers/login.controller";

const workDir = path.resolve(__dirname, "..");
config({ path: `${workDir}/.env` });

const port = process.env.PORT || 3000;

app.post("/register", registerController);
app.post("/login", loginController);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});