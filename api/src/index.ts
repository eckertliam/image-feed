import { config } from "dotenv";
import app from "./app";
import path from "node:path";

const workDir = path.resolve(__dirname, "..");
config({ path: `${workDir}/.env` });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});