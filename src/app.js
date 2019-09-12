import "dotenv/config";
import express from "express";
import "express-async-errors";
import routes from "./routes";
import path from "path";
import "./database";
import * as Sentry from "@sentry/node";
import configSentry from "./config/sentry";
import Youch from "youch";

class App {
  constructor() {
    this.server = express();

    Sentry.init(configSentry);
    this.middlewares();
    this.routes();
    this.exeptionHandle();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exeptionHandle() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === "development") {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: "Internal server error." });
    });
  }
}

export default new App().server;
