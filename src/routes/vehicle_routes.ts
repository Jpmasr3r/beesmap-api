import { Router } from "express";
import { z } from "zod";
import { errorExecption, verifyToken } from "../configs/common.js";
import { User, Vehicle } from "../configs/mongo_models.js";

const vehicleRouter = Router();

vehicleRouter.get("/", async (req, res) => {
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

		const selectVehicles = await Vehicle.find({
			teamId: selectUser.teamId,
		});

		res.status(200).send({
			success: true,
			message: "Sucesso ao listar",
			data: selectVehicles,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

vehicleRouter.post("/", async (req, res) => {
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
			availability: z.boolean({ message: "Disponibilidade invalida" }),
			model: z
				.string({ message: "Modelo invalido" })
				.min(3, { message: "Modelo invalido" }),
		});
		const params = paramsSchema.parse(req.body);

		const vehicle = new Vehicle({
			availability: params.availability,
			model: params.model,
			teamId: selectUser.teamId,
		});
		await vehicle.save();

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

vehicleRouter.put("/:id", async (req, res) => {
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
			availability: z.boolean({ message: "Disponibilidade invalida" }).optional(),
			model: z
				.string({ message: "Modelo invalido" })
				.min(3, { message: "Modelo invalido" })
				.optional(),
		});
		const params = paramsSchema.parse(req.body);

		const vehicleIdSchema = z.string({ message: "Id invalido" });
		const vehicleId = vehicleIdSchema.parse(req.params.id);

		await Vehicle.findByIdAndUpdate(vehicleId, params);

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

vehicleRouter.delete("/:id", async (req, res) => {
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

		const vehicleIdSchema = z.string({ message: "Id invalido" });
		const vehicleId = vehicleIdSchema.parse(req.params.id);

		await Vehicle.findByIdAndDelete(vehicleId);

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

export default vehicleRouter;
