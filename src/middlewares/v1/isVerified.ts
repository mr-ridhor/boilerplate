import { RequestType } from "type/v1/RequestType";
import prisma from "../../prismaClient";
import express from "express";

const isVerified = async (
  req: RequestType,
  res: express.Response,
  next: express.NextFunction
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.userId,
    },
    include: {
      profile: true,
    },
  });

  //   return error if is not permitted to access this endpoint
  if (user.profile.status !== true) {
    return res.status(401).json({
      message: "Account is yet to be verified",
    });
  }
  // allow request to proceed
  next();
};

export default isVerified;
