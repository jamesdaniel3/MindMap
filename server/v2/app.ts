import Koa from "koa";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";
import cors from "@koa/cors";

// Middleware
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";

// Routes
import routes from "./routes/index";

dotenv.config(); // loads env vars

const app = new Koa();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URLs
    credentials: true, // Enable passing of cookies if needed
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// install global middleware
app.use(
  bodyParser({
    enableTypes: ["json", "form"],
    jsonLimit: "5mb",
    formLimit: "5mb",
  })
);
app.use(logger);
app.use(errorHandler);

// register routes
app.use(routes.routes());
app.use(routes.allowedMethods());

app.on("error", (err, ctx) => {
  console.error("Server Error:", err);
});

export default app;
