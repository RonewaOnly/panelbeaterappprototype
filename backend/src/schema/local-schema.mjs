import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import PanelOwner from '../models/user.mjs';

function removeCircularReferences(obj) {
    const seen = new WeakSet();
    return JSON.parse(JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    }));
}

// Add logging to track authentication flow
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // Add this to get more context
    },
    async (req, email, password, done) => {
        try {
            console.log('Authenticating user with email:', email);
            
            const user = await PanelOwner.getPanelOwnerByEmail(email);
            console.log('User found:', !!user); // Log if user was found (true/false)
            
            if (!user) {
                console.log('Authentication failed: User not found');
                return done(null, false, { message: 'Incorrect email.' });
            }

            const safePanel = removeCircularReferences(user);
            const hashedPassword = safePanel[8];
            
            console.log('Comparing passwords...');
            const isMatch = await PanelOwner.comparePassword(password, hashedPassword);
            console.log('Password match:', isMatch);

            if (!isMatch) {
                console.log('Authentication failed: Incorrect password');
                return done(null, false, { message: 'Incorrect password.' });
            }

            console.log('Authentication successful');
            return done(null, safePanel);
        } catch (err) {
            console.error('Authentication error:', err);
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    try {
        console.log('Serializing user:', user[0]); // Log just the ID or relevant identifier
        const safeUser = removeCircularReferences(user);
        done(null, safeUser[0]); // Store just the user ID in the session
    } catch (err) {
        console.error('Serialization error:', err);
        done(err);
    }
});

passport.deserializeUser(async (id, done) => {
    try {
        console.log('Deserializing user ID:', id);
        const user = await PanelOwner.fetchPanelOwnerById(id);
        
        if (!user) {
            console.log('Deserialization failed: User not found');
            return done(null, false);
        }

        const safeUser = removeCircularReferences(user);
        console.log('User deserialized successfully');
        done(null, safeUser);
    } catch (err) {
        console.error('Deserialization error:', err);
        done(err);
    }
});

export default passport;