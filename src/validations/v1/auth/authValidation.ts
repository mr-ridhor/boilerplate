import { body, validationResult } from "express-validator";
import express, { NextFunction } from "express";
import { RequestType } from "type/v1/RequestType";
export const authRegisterValidation = [
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .isString()
    .withMessage("First name must be a string"),

  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 characters long")
    .isString()
    .withMessage("Last name must be a string"),

  body("email")
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid email address"),

  // body("phone")
  //   .notEmpty()
  //   .withMessage("Phone number is required")
  //   .isLength({ min: 2 })
  //   .withMessage("Phone number must be at least 2 characters long")
  //   .isString()
  //   .withMessage("Phone number must be a string"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req: RequestType, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];

export const authLoginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email address is required")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  (req: RequestType, res: express.Response, next: express.NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
