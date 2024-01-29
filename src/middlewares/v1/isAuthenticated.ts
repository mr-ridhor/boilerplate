import Jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../../prismaClient";
import express from "express";
import { RequestType } from "type/v1/RequestType";

const isAuthenticated = async (
  req: RequestType,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Authentication is required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decode: JwtPayload | string = Jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (typeof decode === "string") {
      throw new Error("Token couldn't be decoded.");
    }

    const userId = decode.userId;

    try {
      await prisma.personalAccessToken.findFirstOrThrow({
        where: {
          user: {
            id: userId,
          },
          token: token,
          status: true,
        },
      });

      const user = await prisma.user.findFirstOrThrow({
        where: {
          id: userId,
        },
        include: {
          profile: true,
        },
      });

      req.userId = userId;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        message: "Invalid Authentication token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Authentication token",
    });
  }
};

export default isAuthenticated;
