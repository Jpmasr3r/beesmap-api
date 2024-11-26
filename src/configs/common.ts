import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { z } from "zod";

dotenv.config();

export function createToken(params: object) {
	try {
		const secretKey = process.env.SECRET_KEY;
		if (!secretKey) {
			throw new Error("Secret Key not defined");
		}

		const token = jwt.sign(params, secretKey, { expiresIn: "24h" });
		return {
			token: token,
			message: "Success create token",
			success: true,
		};
	} catch (exception) {
		const error = exception as Error;
		return {
			message: `Error -> ${error.message}`,
			success: false,
		};
	}
}

export function verifyToken(token: string) {
	try {
		const secretKey = process.env.SECRET_KEY;
		if (!secretKey) {
			throw new Error("Secret Key not defined");
		}

		const decoded = jwt.verify(token, secretKey);

		return {
			data: decoded,
			message: "Success decoded",
			success: true,
		};
	} catch (exception) {
		const error = exception as Error;
		return {
			message: `Error -> ${error.message}`,
			success: false,
		};
	}
}

export function errorExecption(exception: unknown) {
	if (exception instanceof z.ZodError) {
		const errors = exception.issues.map((issue) => issue.message);
		return {
			message: errors.join(", "),
			status: 400,
		};
	}
	const error = exception as Error;
	return {
		message: error.message,
		status: 500,
	};
}
