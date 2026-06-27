import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "../../prisma/prisma.js";
import bcrypt from "bcryptjs";
const verifyCallback = async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        
        if (!user) {
            return done(null, false, { message: "User not found" });
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            return done(null, user);
        } else {
            return done(null, false, { message: "Incorrect password" });
        }
    } catch (error) {
        console.error("\n❌ DATABASE CRASH DURING LOGIN:");
        console.error(error);
        console.error("\n");
        return done(error);
    }
}
const strategy = new LocalStrategy({ usernameField: "email" }, verifyCallback);
passport.use(strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (userId, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});
export default passport;
