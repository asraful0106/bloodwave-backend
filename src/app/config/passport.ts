import passport from "passport"; 
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import { User } from "../modules/user/user.model";

export function configurePassport() {
// For local credential login
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        if (!isUserExist) {
          return done("User does not exist.");
        }

        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string,
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match." });
        }

        return done(null, isUserExist);
      } catch (err) {
        done(err);
      }
    },
  ),
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void ) => {
    done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
})
}