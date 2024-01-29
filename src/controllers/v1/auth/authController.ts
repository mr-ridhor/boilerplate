import prisma from "../../../prismaClient";
import Jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sendMail from "../../../actions/v1/mailer";
import express from "express";
import { RequestType } from "type/v1/RequestType";

// registration function
export const authRegister = async (req: RequestType, res: express.Response) => {
  const { first_name, last_name, email, username, type, password } = req.body;

  const checkUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (checkUser) {
    return res.status(409).json({
      message: "Email already exists",
    });
  }

  // hash user password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Generate four random numbers
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  const token = randomNumber.toString().padStart(6, "0");
  // store the user into the database
  const user = await prisma.user.create({
    data: {
      email,
      username,
      first_name,
      last_name,
      password: hashedPassword,
      profile: {
        create: {
          verificationCode: token,
        },
      },
    },
  });

  // generate a jwt token for this registration
  const payload = {
    userId: user.id,
  };
  // send verification email
  await sendMail(
    email,
    { ...user, token: token },
    "Verification Email",
    "welcome"
  );
  Jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "30d" },
    async (err, token) => {
      if (err || !token) {
        console.log("err",err.message)
        return res.status(500).json({
          message: "Something went wrong",
          err:err.message
        });
      }

      // store the access token to the database
      const expireAt = new Date();
      expireAt.setDate(expireAt.getDate() + 30);
      await prisma.personalAccessToken.create({
        data: {
          token,
          expireAt,
          user: {
            connect: { id: user.id },
          },
        },
      });
      // return the user and the token
      return res.status(201).json({
        user,
        token,
      });
    }
  );
};

export const authCheckVerification = async (
  req: RequestType,
  res: express.Response
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: req.userId,
    },
    include: {
      profile: true,
    },
  });

  return res.status(200).json({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    status: user.profile.status,
    code:user.profile.verificationCode
  });
};

export const authVerify = async (req: RequestType, res: express.Response) => {
  const { verification_token } = req.body;
  //   throw error if no token is found
  if (!verification_token || verification_token.length != 6) {
    return res.status(422).json({
      message: "token is required",
    });
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.userId,
      },
      include: {
        profile: true,
      },
    });

    if (verification_token !== user.profile.verificationCode) {
      return res.status(401).json({
        message: "Invalid verification token",
      });
    } else if (user.profile.status === true) {
      return res.status(200).json({
        message: "Account verified successfully",
      });
    }

    try {
      await prisma.profile.update({
        where: {
          userId: req.userId,
        },
        data: {
          status: true,
        },
      });
      return res.status(200).json({
        message: "Account verified successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const authResendVerification = async (
  req: RequestType,
  res: express.Response
) => {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id: req.userId,
      },
      include: {
        profile: true,
      },
    });

    if (user.profile.status === true) {
      return res.status(200).json({
        message: "Account already verified",
      });
    }

    // send verification email
    await sendMail(
      user.email,
      { ...user, token: user.profile.verificationCode },
      "Verification Email",
      "welcome"
    );
    return res.status(200).json({
      message: "Verification code resent back to your email address",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const authLogin = async (
  req: express.Request,
  res: express.Response
) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        email: email,
      },
      include: {
        profile: true,
      },
    });

    const comparedPassword = bcrypt.compareSync(password, user.password);
    if (!comparedPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // generate a jwt token for this registration
    const payload = {
      userId: user.id,
    };
    Jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      async (err, token) => {
        if (err || !token) {
          return res.status(500).json({
            message: "Something went wrong",
          });
        }

        // store the access token to the database
        const expireAt = new Date();
        expireAt.setDate(expireAt.getDate() + 30);
        await prisma.personalAccessToken.create({
          data: {
            token,
            expireAt,
            user: {
              connect: { id: user.id },
            },
          },
        });
        // return the user and the token
        return res.status(201).json({
          user,
          token,
        });
      }
    );
  } catch (error) {
    return res.status(401).json({
      message: "Email or password does not exist",
    });
  }
};
