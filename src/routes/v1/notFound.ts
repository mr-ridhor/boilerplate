import express from "express";

const notFound = (req: express.Request, res: express.Response) => {
  return res.status(404).json({
    message: "route does not exist",
  });
};

export default notFound;
