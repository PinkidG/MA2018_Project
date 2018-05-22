const AuthenticationController = require('./controllers/authentication'),
    IllnessController = require('./controllers/illnessController'),
    UserController = require('./controllers/userController')
express = require('express'),
    passportService = require('./config/passport'),
    passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });


// Constants for role types
const REQUIRE_ADMIN = "Admin",
    REQUIRE_PATIENT = "Patient",
    REQUIRE_DOCTOR = "Doctor";

module.exports = function(app) {
    // Initializing route groups
    const apiRoutes = express.Router(),
        authRoutes = express.Router();

    //=========================
    // Auth Routes
    //=========================

    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // Registration route
    authRoutes.post('/register', AuthenticationController.register);

    // Login route
    authRoutes.post('/login', requireLogin, AuthenticationController.login);

    // Illness route
    apiRoutes.post('/illness', requireAuth, IllnessController.register);
    apiRoutes.get('/illnesses', requireAuth, IllnessController.getAll);
    apiRoutes.get('/illness/:id', requireAuth, IllnessController.getById);

    // User route
    apiRoutes.get('/users', requireAuth, AuthenticationController.getAll);
    apiRoutes.get('/user/:id', requireAuth, AuthenticationController.getUser);
    apiRoutes.get('/usern/:name', requireAuth, AuthenticationController.getUserByName);
    apiRoutes.post('/user/:id/addIllness/:illnessId', requireAuth, UserController.addIllness);

    app.get('/', requireAuth, function(req, res) {
        res.send('Server is up and Running');
    });

    // Set url for API group routes
    app.use('/api', apiRoutes);
};