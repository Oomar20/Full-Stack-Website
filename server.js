const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express(); // creates the express app

// Configure session middleware
app.use(session({
    secret: '123', // used to sign the session ID cookie
    resave: false, // prevents the session from being saved back if it hasn't been modified
    saveUninitialized: false, // prevents creating a session untill something is stored in
    cookie: { maxAge: 1800000 } // session duration == 30 min
}));

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use EJS as a view engine
app.set('view engine', 'ejs');

// Connect to MongoDB
const dbURI = 'mongodb+srv://ouser:user123@awp.sql5fhk.mongodb.net/users?retryWrites=true&w=majority&appName=awp';
mongoose.connect(dbURI)
    .then(() => app.listen(5000, () => console.log('Server is running on port 5000')))
    .catch((err) => console.error(err));


// Serve static files from the 'public', 'Images', and 'styles' directories
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Registering new users
app.post('/register', async (req, res) => {
    try {
        const { email, password, name, surname, gender, age } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ email, password: hashedPassword, name, surname, gender, age });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while registering the user' });
    }
});

// User login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        req.session.user = user;
        res.status(200).json({ message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred during login' });
    }
});


// Update account
app.post('/account', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { email, name, surname, gender, age } = req.body;

        const userId = req.session.user._id;
        const updatedUser = await User.findByIdAndUpdate(userId, { email, name, surname, gender, age }, { new: true });

        req.session.user = updatedUser;
        res.json({ message: 'Account updated successfully', user: req.session.user });
    } catch (err) {
        res.status(500).json({ message: 'An error occurred while updating the account' });
    }
});


// Define routes
app.get('/', (req, res) => res.render('store', { user: req.session.user }));
app.get('/store', (req, res) => res.render('store', { user: req.session.user }));
app.get('/about', (req, res) => res.render('about', { user: req.session.user }));
app.get('/login', (req, res) => res.render('login', { user: req.session.user }));
app.get('/register', (req, res) => res.render('register', { user: req.session.user }));
app.get('/memberships', (req, res) => res.render('memberships', { user: req.session.user }));
app.get('/account', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('account', { user: req.session.user });
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('An error occurred during logout');
        }
        res.redirect('/login');
    });
});

// 404 route
app.use((req, res) => res.status(404).render('404', { user: req.session.user }));
