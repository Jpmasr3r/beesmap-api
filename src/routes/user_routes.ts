import bcrypt from "bcryptjs";
import { Router } from "express";
import { z } from "zod";
import { createToken, errorExecption, verifyToken } from "../configs/common.js";
import { Admin, User } from "../configs/mongo_models.js";

const userRouter: Router = Router();

//insert user
userRouter.post("/", async (req, res) => {
	try {
		const userSchema = z
			.object({
				name: z.string({ message: "Nome inválido" }),
				email: z
					.string({ message: "Email inválido" })
					.email({ message: "Insira um email válido" }),
				password: z
					.string({ message: "Senha inválida" })
					.min(8, { message: "Senha muito curta, mínimo 8 caracteres" }),
				confirmPassword: z
					.string({ message: "Confirmação de senha inválida" })
					.min(8, {
						message: "Confirmação de senha muito curta, mínimo 8 caracteres",
					}),
			})
			.refine((data) => data.password === data.confirmPassword, {
				message: "As senhas não correspondem",
				path: ["confirmPassword"],
			});

		const params = userSchema.parse(req.body);

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(params.password, salt);

		const user = new User({
			email: params.email,
			name: params.name,
			password: hash,
		});
		await user.save();

		res.send({
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

//get users
userRouter.get("/", async (req, res) => {
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

//delete user
userRouter.delete("/", async (req, res) => {
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

		const userSchema = z.object({ id: z.string({ message: "ID inválido" }) });
		const user = userSchema.parse(decoded.data);

		await User.findByIdAndDelete(user.id);
		res.send({
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

//update user
userRouter.put("/", async (req, res) => {
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

		const userIdSchema = z.object({ id: z.string({ message: "ID inválido" }) });

		const userSchema = z.object({
			name: z.string({ message: "Nome inválido" }).optional(),
			email: z
				.string({ message: "Email inválido" })
				.email({ message: "Insira um email válido" })
				.optional(),
		});

		const params = userSchema.parse(req.body);
		const userId = userIdSchema.parse(decoded.data);

		await User.findByIdAndUpdate(userId.id, params);
		res.send({
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

//update password
userRouter.put("/password", async (req, res) => {
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
		const userIdSchema = z.object({ id: z.string({ message: "ID inválido" }) });
		const userId = userIdSchema.parse(decoded.data);

		const userSchema = z
			.object({
				password: z
					.string({ message: "Senha invalida" })
					.min(8, { message: "Senha muito curta, mínimo 8 caracteres" }),
				newPassword: z
					.string({ message: "Nova senha invalida" })
					.min(8, { message: "Nova senha muito curta, mínimo 8 caracteres" }),
				newConfirmPassword: z
					.string({ message: "Nova confirmação de senha invalida" })
					.min(8, {
						message: "Nova confirmação de senha muito curta, mínimo 8 caracteres",
					}),
			})
			.refine((data) => data.newPassword === data.newConfirmPassword, {
				message: "As novas senhas não correspondem",
				path: ["newConfirmPassword"],
			});

		const user = await User.findById(userId.id);

		if (!user) {
			res.status(400).send({
				success: false,
				message: "Você não deveria estar aqui",
			});
			return;
		}

		const params = userSchema.parse(req.body);
		if (!bcrypt.compareSync(params.password, user.password)) {
			res.status(400).send({
				success: false,
				message: "Senha incorreta",
			});
			return;
		}

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(params.newPassword, salt);

		await User.findByIdAndUpdate(userId.id, {
			password: hash,
		});

		res.send({
			success: true,
			message: "Sucesso ao atualizar a senha",
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

//login
userRouter.post("/login", async (req, res) => {
	try {
		const userSchema = z.object({
			email: z
				.string({ message: "Email inválido" })
				.email({ message: "Insira um email válido" }),
			password: z
				.string({ message: "Senha inválida" })
				.min(8, { message: "Senha muito curta, mínimo 8 caracteres" }),
		});

		const params = userSchema.parse(req.body);

		const user = await User.findOne({ email: params.email });

		if (!user) {
			res.status(400).send({
				success: false,
				message: "Email não cadastrado",
			});
			return;
		}

		if (!bcrypt.compareSync(params.password, user.password)) {
			res.status(400).send({
				success: false,
				message: "Senha incorreta",
			});
			return;
		}

		const token = createToken({ id: user.id }).token;
		res.send({
			success: true,
			token: token,
			message: "Sucesso ao logar",
		});
	} catch (exception) {
		const error = errorExecption(exception);
		res.status(error.status).send({
			success: false,
			message: error.message,
		});
	}
});

export default userRouter;
