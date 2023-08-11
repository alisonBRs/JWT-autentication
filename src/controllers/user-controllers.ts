import { Request, Response } from "express";
import { userServices } from "../services/user-services";
import { PostUserType } from "../interfaces/post-user-type";
import { prisma } from "../initialize-prisma/initialize-prisma";
import bcrypt from "bcrypt";

export class UserControllers {
  async getUser(req: Request, res: Response) {
    const response = await userServices.getUser();

    return res.status(200).json(response);
  }

  async postUser(req: Request, res: Response) {
    const { name, password, email }: PostUserType = req.body;

    const emailAlreadyExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    try {
      if (emailAlreadyExists) {
        return res.status(400).json({ error: `email ${email} already exists` });
      }

      const passwordIncrypted: string = await bcrypt.hash(password, 10);

      const result = await userServices.postUserData({
        name,
        password: passwordIncrypted,
        email,
      });

      const { password: undefined, ...user } = result;

      return res.status(200).json(user);
    } catch (err) {
      console.error(err);
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = Number(req.params.id);

    const idNoExist = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    try {
      if (!idNoExist) {
        return res.status(400).json({ error: `id ${id} not exist` });
      }

      await userServices.deleteUser(id);

      return res.status(200).json({ success: `User id: ${id} deleted` });
    } catch (err) {
      console.error(err);
    }
  }

  async login(req: Request, res: Response) {
    const { email, password }: PostUserType = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    try {
      if (!user) {
        return res.status(401).json({ error: "email or password not found" });
      }

      const verifyPassword = await bcrypt.compare(
        password,
        user?.password as string
      );

      if (!verifyPassword) {
        return res.status(401).json({ error: "email or password not found" });
      }

      return res.status(202).json({ success: "login access accepted" });
    } catch (err) {
      console.error(err);
    }
  }
}

export const userControllers = new UserControllers();
