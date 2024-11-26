import { Router } from "express";
import { z } from "zod";
import { errorExecption, verifyToken } from "../configs/common.js";
import { Admin, Team, User } from "../configs/mongo_models.js";

const teamRouter = Router();

//select teams
teamRouter.get("/", async (req, res) => {
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
		const user = adminSchema.parse(decoded.data);
		const selectAdmin = await Admin.findOne({
			userId: user.id,
		});

		if (!selectAdmin) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não é um admin",
			});
			return;
		}

		const teams = await Team.find();

		res.status(200).send({
			success: true,
			message: "Sucesso ao listar",
			data: teams,
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

//insert team
teamRouter.post("/", async (req, res) => {
	try {
		const tokenSchema = z.string({ message: "Token inválido" });
		const teamNameSchema = z.string({ message: "Nome da equipe inválido" });
		const userSchema = z.object({
			id: z.string({ message: "ID de usuário inválido" }),
		});

		const token = tokenSchema.parse(req.headers.token);
		const teamName = teamNameSchema.parse(req.body.name);

		const decoded = verifyToken(token);
		if (!decoded.success) {
			res.status(401).send({
				success: false,
				message: "Erro -> você não devia estar aqui",
			});
			return;
		}

		const user = userSchema.parse(decoded.data);

		const team = new Team({
			leaderId: user.id,
			name: teamName,
		});

		await team.save();

		await User.findByIdAndUpdate(user.id, {
			teamId: team._id,
		});

		res.status(201).send({
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

//delete team
teamRouter.delete("/", async (req, res) => {
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
			res.status(404).send({
				success: false,
				message: "Usuário não encontrado",
			});
			return;
		}

		await Team.findByIdAndDelete(selectUser.teamId);

		const members = await User.find({
			teamId: selectUser.teamId,
		});

		await Promise.all(
			members.map(async (member) => {
				member.teamId = null;
				await member.save();
			}),
		);

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

//update team
teamRouter.put("/", async (req, res) => {
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
			res.status(404).send({
				success: false,
				message: "Usuário não encontrado",
			});
			return;
		}

		const paramsSchema = z.object({
			name: z.string({ message: "Nome da equipe inválido" }).optional(),
			leaderId: z.string({ message: "ID do líder inválido" }).optional(),
		});
		const params = paramsSchema.parse(req.body);

		await Team.findByIdAndUpdate(selectUser.teamId, params);

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

//join team
teamRouter.post("/join/:name", async (req, res) => {
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

		const teamNameSchema = z.string({ message: "Nome da Equipe inválido" });
		const teamName = teamNameSchema.parse(req.params.name);

		const selectTeam = await Team.findOne({
			name: teamName,
		});

		if (!selectTeam) {
			res.status(404).send({
				success: false,
				message: "Esta equipe não existe",
			});
			return;
		}

		await User.findByIdAndUpdate(user.id, {
			teamId: selectTeam._id,
		});

		res.status(200).send({
			success: true,
			message: "Sucesso ao se juntar a equipe",
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

export default teamRouter;
