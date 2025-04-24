import { Router } from "express";
import { z } from "zod";
import { errorExecption, verifyToken } from "../configs/common.js";
import { Area, Production, User } from "../configs/mongo_models.js";

const productionRouter = Router();

productionRouter.get("/", async (req, res) => {
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

		const userSchema = z.object({
			id: z.string({ message: "ID Inválido" }),
		});
		const user = userSchema.parse(decoded.data);
		const selectUser = await User.findById(user.id);

		if (!selectUser) {
			res.status(401).send({
				success: true,
				message: "Usuario não encontrado",
			});
			return;
		}

		const selectProdutions = await Production.find({
			teamId: selectUser.teamId,
		});

		res.status(200).send({
			success: true,
			message: "Sucesso ao listar",
			data: selectProdutions,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

productionRouter.post("/", async (req, res) => {
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

		const userSchema = z.object({
			id: z.string({ message: "ID Inválido" }),
		});
		const user = userSchema.parse(decoded.data);
		const selectUser = await User.findById(user.id);

		if (!selectUser) {
			res.status(401).send({
				success: true,
				message: "Usuario não encontrado",
			});
			return;
		}

		const paramsSchema = z.object({
			date: z.date({ message: "Data invalida" }),
			amount: z
				.number({ message: "Quantidade invalida" })
				.positive({ message: "Quantidade invalida" }),
			areaName: z
				.string({ message: "Nome da area invalido" })
				.min(3, { message: "Nome da area muito curto, minimo 3 caracteres" }),
		});
		const params = paramsSchema.parse(req.body);

		const selectArea = await Area.findOne({
			name: params.areaName,
		});

		if (!selectArea) {
			res.status(401).send({
				success: true,
				message: "Area não encontrado",
			});
			return;
		}

		const prodution = new Production({
			amount: params.amount,
			date: params.date,
			teamId: selectUser.teamId,
			areaId: selectArea._id,
		});
		await prodution.save();

		res.status(200).send({
			success: true,
			message: "Sucesso ao inserir",
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

productionRouter.put("/:id", async (req, res) => {
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

		const paramsSchema = z.object({
			date: z.date({ message: "Data invalida" }).optional(),
			amount: z.number({ message: "Quantidade invalida" }).positive(),
		});
		const params = paramsSchema.parse(req.body);

		const productionIdSchema = z.string({ message: "Id invalido" });
		const productionId = productionIdSchema.parse(req.params.id);

		Production.findByIdAndUpdate(productionId, params);

		res.status(200).send({
			success: true,
			message: "Sucesso ao atualizar",
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

productionRouter.delete("/:id", async (req, res) => {
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

		const productionIdSchema = z.string({ message: "Id invalido" });
		const productionId = productionIdSchema.parse(req.params.id);

		Production.findByIdAndDelete(productionId);

		res.status(200).send({
			success: true,
			message: "Sucesso ao deletar",
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

export default productionRouter;
