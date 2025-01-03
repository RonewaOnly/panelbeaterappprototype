import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import PanelOwner from '../models/user.mjs';

// Custom function to remove circular references
function removeCircularReferences(obj) {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;  // Avoid circular reference
            }
            seen.add(value);
        }
        return value;
    }));
}

passport.use(new LocalStrategy(
    {
        usernameField: 'email', // Assuming you're using email as the username
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await PanelOwner.getPanelOwnerByEmail(email);
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            const safePanel = removeCircularReferences(user)
            const hasedpassword = safePanel[8];
            const isMatch = await PanelOwner.comparePassword(password,hasedpassword); // Assuming you have a method to compare passwords
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await PanelOwner.fetchPanelOwnerById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});
export default passport
