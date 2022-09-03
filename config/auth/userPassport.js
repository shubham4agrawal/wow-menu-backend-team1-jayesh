import passport from "passport";
import LocalStrategy from "passport-local";
import { Users } from "../../src/models";
import bcrypt from "bcrypt";
import generateJWTToken from "../../src/utils/generateJWTTokenUtil";

const localStrategy = new LocalStrategy(
  {},
  async (username, password, done) => {
    try {
      let user;
      if (validateEmail(username)) {
        user = await Users.find({ emailId: username }).populate("restaurant");
      } else {
        user = await Users.find({ username }).populate("restaurant");
      }

      if (user.length === 0) {
        return done(null, false, {
          message: "Username/Email is not registered",
        });
      } else {
        if (await bcrypt.compare(password, user[0].password)) {
          const payload = user[0];
          payload["password"] = undefined;
          const accessToken = generateJWTToken(payload, "access");
          const refreshToken = generateJWTToken(payload, "refresh");
          return done(null, {
            userDetails: payload,
            accessToken,
            refreshToken,
          });
        } else {
          return done(null, false);
        }
      }
    } catch (error) {
      return done(error);
    }
  },
);

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, // eslint-disable-line
    );
};

passport.use(localStrategy);

export const authLocalUser = passport.authenticate("local", {
  session: false,
  failWithError: false,
});
