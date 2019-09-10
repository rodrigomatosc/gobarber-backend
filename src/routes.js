import { Router } from "express";
import multer from "multer";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import authMiddleware from "./app/middlewares/auth";
import multerConfig from "./config/multer";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";
import ApponimentsController from "./app/controllers/AppointmentController";
import SchedulerController from "./app/controllers/SchedulerController";

const routes = new Router();
const upload = multer(multerConfig);

// ############ routes for users ################ //
routes.post("/users", UserController.store);
routes.put("/users", authMiddleware, UserController.update);

// ############ routes for sessions ################ //
routes.post("/sessions", SessionController.store);

// ############ routes for files ################ //
routes.post("/files", upload.single("file"), FileController.store);

// ############ routes for providers ################ //
routes.get("/providers", ProviderController.index);

// ############ routes for appointments ################ //
routes.post("/appointments", authMiddleware, ApponimentsController.store);
routes.get("/appointments", authMiddleware, ApponimentsController.index);

// ############ routes for scheduler ################ //
routes.get("/schedule", authMiddleware, SchedulerController.index);

export default routes;
