import { Router } from "express";
import { z } from "zod";
import { errorExecption, verifyToken } from "../configs/common.js";
import { Sale, User } from "../configs/mongo_models.js";

const saleRouter = Router();

saleRouter.get("/", async (req, res) => {
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

		const selectSales = await Sale.find({
			teamId: selectUser.teamId,
		});

		res.status(200).send({
			success: true,
			message: "Sucesso ao listar",
			data: selectSales,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

saleRouter.post("/", async (req, res) => {
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
			buyer: z.string({ message: "Comprador invalido" }).min(3, {
				message: "Nome do comprador muito curto, minimo 3 caracteres",
			}),
			salePrice: z
				.number({ message: "Preço de venda invalido" })
				.positive({ message: "Preço de venda invalido" }),
		});
		const params = paramsSchema.parse(req.body);

		const sale = new Sale({
			amount: params.amount,
			buyer: params.buyer,
			date: params.date,
			salePrice: params.salePrice,
			teamId: selectUser.teamId,
		});
		await sale.save();

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

saleRouter.put("/:id", async (req, res) => {
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
			amount: z
				.number({ message: "Quantidade invalida" })
				.positive({ message: "Quantidade invalida" })
				.optional(),
			buyer: z
				.string({ message: "Comprador invalido" })
				.min(3, {
					message: "Nome do comprador muito curto, minimo 3 caracteres",
				})
				.optional(),
			salePrice: z
				.number({ message: "Preço de venda invalido" })
				.positive({ message: "Preço de venda invalido" })
				.optional(),
		});
		const params = paramsSchema.parse(req.body);

		const saleIdSchema = z.string({ message: "Id invalido" });
		const saleId = saleIdSchema.parse(req.params.id);

		await Sale.findByIdAndUpdate(saleId, params);

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

saleRouter.delete("/:id", async (req, res) => {
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

		const saleIdSchema = z.string({ message: "Id invalido" });
		const saleId = saleIdSchema.parse(req.params.id);

		await Sale.findByIdAndDelete(saleId);

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

export default saleRouter;
