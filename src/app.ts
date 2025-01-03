import express, { Router } from "express";
import adminRouter from "./routes/admin_routes.js";
import areaRouter from "./routes/area_routes.js";
import productionRouter from "./routes/production_routes.js";
import saleRouter from "./routes/sale_routes.js";
import teamRouter from "./routes/team_routes.js";
import userRouter from "./routes/user_routes.js";
import vehicleRouter from "./routes/vehicle_routes.js";
import cors from "cors";

const app: express.Express = express();
app.use(cors());
app.use(express.json());

// Routes back-end
app.use("/user", userRouter);
app.use("/team", teamRouter);
app.use("/area", areaRouter);
app.use("/sale", saleRouter);
app.use("/prodution", productionRouter);
app.use("/vehicle", vehicleRouter);
app.use("/admin", adminRouter);

const mainRouter = Router();
mainRouter.get("/", (req, res) => {
	res.send({
		message: "Bem vindo ao beesmap",
	}).status(200);
});
app.use(mainRouter);

export default app;
