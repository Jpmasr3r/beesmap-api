import { Router } from "express";
import { z } from "zod";
import { errorExecption, verifyToken } from "../configs/common.js";
import {
	Admin,
	Area,
	Production,
	Sale,
	Team,
	User,
	Vehicle,
} from "../configs/mongo_models.js";

const adminRouter = Router();

adminRouter.get("/user", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const users = await User.find();

		res.send({
			success: true,
			message: "Sucesso ao listar",
			data: users,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

adminRouter.get("/team", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const teams = await Team.find();

		res.send({
			success: true,
			message: "Sucesso ao listar",
			data: teams,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

adminRouter.get("/area", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const areas = await Area.find();

		res.send({
			success: true,
			message: "Sucesso ao listar",
			data: areas,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

adminRouter.get("/production", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const productions = await Production.find();

		res.send({
			success: true,
			message: "Sucesso ao listar",
			data: productions,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

adminRouter.get("/sale", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const sales = await Sale.find();

		res.send({
			success: true,
			message: "Sucesso ao listar",
			data: sales,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

adminRouter.get("/vehicle", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const vehicles = await Vehicle.find();

		res.send({
			success: true,
			message: "Sucesso ao listar",
			data: vehicles,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

//admin

adminRouter.get("/", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const admins = await Admin.find().populate("userId").exec();

		res.send({
			success: true,
			message: "Sucesso ao listar",
			data: admins,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

adminRouter.post("/", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const paramsSchema = z.object({
			userId: z.string({ message: "Id invalido" }),
		});
		const params = paramsSchema.parse(req.body);

		await new Admin({
			userId: params.userId,
		}).save();

		res.send({
			success: true,
			message: "Sucesso ao inserir",
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

adminRouter.delete("/", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const token = tokenSchema.parse(req.headers.token);
		const decoded = verifyToken(token);

		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const adminSchema = z.object({
			id: z.string({ message: "ID inválido" }),
		});
		const admin = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: admin.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const paramsSchema = z.object({
			userId: z.string({ message: "Id invalido" }),
		});
		const params = paramsSchema.parse(req.body);

		await Admin.findOneAndDelete(params);

		res.send({
			success: true,
			message: "Sucesso ao deletar",
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(500).send({
			success: false,
			message: error.message,
		});
	}
});

adminRouter.get("/test", (req, res) => {
	res.send("Hellow World!");
});

export default adminRouter;
