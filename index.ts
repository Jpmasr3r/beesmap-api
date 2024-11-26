import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

try {
	app.listen(process.env.PORT || 3333);
} catch (exception) {
	const error = exception as Error;
	console.log(`Error -> ${error.message}`);
}
