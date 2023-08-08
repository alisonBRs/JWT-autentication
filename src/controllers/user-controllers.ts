import { Request, Response } from "express";
import { userServices } from "../services/user-services";
import { PostUserType } from "../interfaces/post-user-type";
import { prisma } from "../initialize-prisma/initialize-prisma";

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

      await userServices.postUserData({ name, password, email });

      const result = {
        name,
        password,
        email,
        post: [],
      };

      return res.status(200).json(result);
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
}

export const userControllers = new UserControllers();
