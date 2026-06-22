import bcrypt from "bcryptjs";
import { prisma } from "../../prisma/prisma.js";

export const signUpUser = async (req, res, next) => {
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
      if (err) return next(err);
      
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
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const loginUser = (req, res) => {
  const safeUser = {
    id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    membership: req.user.membership,
    admin: req.user.admin,
  };

  return res.status(200).json({
    success: true,
    message: "User logged in!",
    user: safeUser,
  });
};

export const checkAuthStatus = (req, res) => {
  if (req.isAuthenticated()) {
    const safeUser = {
      id: req.user.id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      membership: req.user.membership,
      admin: req.user.admin,
    };
    return res.status(200).json({ isAuthenticated: true, user: safeUser });
  } else {
    return res.status(200).json({ isAuthenticated: false, user: null });
  }
};

export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.status(200).json({ success: true, message: "Successfully logged out" });
  });
};