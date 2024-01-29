import { RequestType } from "type/v1/RequestType";
import asyncWrapper from "../../../middlewares/v1/asyncWrapper";
import prisma from "../../../prismaClient";
import express from "express";

export const getUser = asyncWrapper(
  async (req: RequestType, res: express.Response) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.userId,
      },
      include: {
        profile: true,
      },
    });

    return res.status(200).json({
      user,
    });
  }
);
