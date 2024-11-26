import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

try {
	const MONGO_URL = process.env.MONGO_URL;

	if (MONGO_URL == null) {
		throw new Error("Erro -> Mongo Url não definida");
	}

	mongoose.connect(MONGO_URL);
} catch (exception) {
	const error = exception as Error;
	console.log(`Error -> ${error.message}`);
}

export default mongoose;
