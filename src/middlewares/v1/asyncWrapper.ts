import express from "express";
const asyncWrapper = (fn: any) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
};

export default asyncWrapper;
