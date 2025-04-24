import { Router } from "express";
import { z } from "zod";
import { errorExecption, verifyToken } from "../configs/common.js";
import { Area, User } from "../configs/mongo_models.js";

const areaRouter = Router();

areaRouter.get("/", async (req, res) => {
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
		}

		const selectAreas = await Area.find({
			teamId: selectUser?.teamId,
		});

		res.status(200).send({
			success: true,
			message: "Sucesso ao listar",
			data: selectAreas,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

areaRouter.post("/", async (req, res) => {
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
			name: z.string({ message: "Nome inválido" }),
			description: z.string({ message: "Descrição inválida" }),
			latitude: z.number({ message: "Latitude inválida" }),
			longitude: z.number({ message: "Longitude inválida" }),
			teamId: z.string({ message: "Descrição inválida" }).optional(),
		});
		const params = paramsSchema.parse(req.body);
		params.teamId = selectUser.teamId;

		const area = new Area(params);
		await area.save();

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

areaRouter.put("/:name", async (req, res) => {
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

		const areaNameSchema = z.string({ message: "Nome da Area inváldo" });
		const areaName = areaNameSchema.parse(req.params.name);

		const paramsSchema = z.object({
			name: z
				.string({ message: "Nome inválido" })
				.min(3, { message: "Nome muito curto, minimo 3 caractres" })
				.optional(),
			description: z.string({ message: "Descrição inválida" }).optional(),
			latitude: z.number({ message: "Latitude inválida" }).optional(),
			longitude: z.number({ message: "Longitude inválida" }).optional(),
			quantityBoxes: z.number({ message: "Quantidade de caixas inválida" }).optional(),
		});
		const params = paramsSchema.parse(req.body);

		await Area.findOneAndUpdate(
			{
				name: areaName,
				teamId: selectUser.teamId,
			},
			params,
		);

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

areaRouter.delete("/:name", async (req, res) => {
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

		const areaNameSchema = z.string({ message: "Nome da Area inváldo" });
		const areaName = areaNameSchema.parse(req.params.name);

		await Area.findOneAndDelete({
			name: areaName,
			teamId: selectUser.teamId,
		});

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

export default areaRouter;
