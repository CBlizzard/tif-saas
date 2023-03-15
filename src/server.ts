import express, { Express } from "express";
import { connect } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import communityRoutes from "./routes/communityRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app: Express = express();
const PORT = process.env.PORT || 8000;
dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/v1/community", communityRoutes);
app.use("/v1/member", memberRoutes);
app.use("/v1/role", roleRoutes);
app.use("/v1/auth", userRoutes);

// connect to DB
connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening 🦻 on port ${PORT}!!  `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
