import { prisma } from "../initialize-prisma/initialize-prisma";
import { PostUserType } from "../interfaces/post-user-type";

export class UserServices {
  async getUser() {
    const result = await prisma.user.findMany({
      include: {
        post: true,
      },
    });

    return result;
  }

  async postUserData({ name, password, email }: PostUserType) {
    const postData = await prisma.user.createMany({
      data: {
        name,
        password,
        email,
      },
    });

    return postData;
  }

  async deleteUser(id: number) {
    const deleteUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    return deleteUser;
  }
}

export const userServices = new UserServices();
