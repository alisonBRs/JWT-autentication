import { Request, Response } from "express";
import { prisma } from "../initialize-prisma/initialize-prisma";
import { PostUserType } from "../interfaces/post-user-type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface PayLoad {
  id: number;
  password: string;
}

class UserLogin {
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

      const { password: _, ...userData } = user;

      const token = jwt.sign({ id: user.id }, process.env.token_key as string, {
        expiresIn: "1h",
      });

      return res
        .status(202)
        .cookie("token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 1000000,
        })
        .json({
          user: userData,
          token,
        });
    } catch (err) {
      console.error(err);
    }
  }

  async getProfile(req: Request, res: Response) {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const token = authorization.split(" ")[1];

    const { id } = jwt.verify(
      token,
      process.env.token_key as string
    ) as PayLoad;

    if (!id) {
      return res.status(401).json({ error: "User not authorized" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    const { password: _, ...loggedUser } = user as PayLoad;

    return res.json({ loggedUser });
  }
}

export const userLogin = new UserLogin();
