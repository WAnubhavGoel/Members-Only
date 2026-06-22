import { Router } from "express";
import passport from "passport";
import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/prisma.js";
const authRouter = Router();

authRouter.post("/sign-up", async (req, res, next) => {
  try {
    const pass = await bcrypt.hash(req.body.password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: pass,
      },
    });

    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
    });

    const safeUser = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      membership: newUser.membership,
      admin: newUser.admin,
    };

    return res.status(201).json({
      success: true,
      message: "User successfully created and logged in!",
      user: safeUser,
    });
  } catch (error) {
    console.error("Sign-up error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

authRouter.post("/login", passport.authenticate("local"), (req, res) => {
  try {
    const safeUser = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      membership: req.user.membership,
      admin: req.user.admin,
    };

    return res.status(201).json({
      success: true,
      message: "User logged in!",
      user: safeUser,
    });
  } catch(error) {
    console.error("Sign-up error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

export { authRouter };
