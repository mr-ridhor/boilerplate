import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index";
import notFound from "./routes/v1/notFound";

dotenv.config();
// initialize the app
const app = express();
// connect required middleware's
app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(routes);
app.use(notFound);
// write a function to start the app
const startApp = () => {
  try {
    app.listen(process.env.PORT, () =>
      console.log(`app listening on port ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
};

// start the app
startApp();
