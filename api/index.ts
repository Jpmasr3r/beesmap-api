import app from "../src/app.js";
import dotenv from "dotenv";

dotenv.config();

const vercelApi = app.listen(process.env.PORT, () =>
	console.log(`Serve rodando em http://localhost:${process.env.PORT}`),
);

export default vercelApi;
