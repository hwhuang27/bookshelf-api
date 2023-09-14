const bcrypt = require("bcryptjs");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;

// authentication middleware
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            };
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                // passwords do not match
                return done(null, false, { message: "Incorrect password" });
            };
            return done(null, user);
        } catch (err) {
            return done(err);
        };
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    };
});

