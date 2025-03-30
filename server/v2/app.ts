import Koa from "koa";
import bodyParser from "koa-bodyparser";
import dotenv from "dotenv";

// Middleware
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./middleware/logger";

// Routes
import routes from "./routes/index";

dotenv.config(); // loads env vars

const app = new Koa();

// install global middleware
app.use(errorHandler);
app.use(logger);
app.use(bodyParser());

// register routes
app.use(routes.routes());
app.use(routes.allowedMethods());

app.on("error", (err, ctx) => {
  console.error("Server Error:", err);
});

export default app;
