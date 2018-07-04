const AuthenticationController = require('./controllers/authentication'),
    IllnessController = require('./controllers/illnessController'),
    UserController = require('./controllers/userController'),
    TreatmentController = require('./controllers/treatmentController'),
    TopicController = require('./controllers/topicController'),
    EntryController = require('./controllers/entryController'),
    VideoController = require('./controllers/videoController'),
    DiaryEntryController = require('./controllers/diaryEntryController'),
    express = require('express'),
    passportService = require('./config/passport'),
    passport = require('passport');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

//Setting up multer for fileupload
var path = process.cwd() + '/data/';
var multer = require('multer');
var Storage = multer.memoryStorage({
    destination: function (req, file, cb) {
        cb(null, path)
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, ext)
    },
    inMemory: true
});

var upload = multer({ storage: Storage });

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
    apiRoutes.post('/illness/:id/addTreatment/:treatmentId', requireAuth, IllnessController.addTreatment);

    // Treatment route
    apiRoutes.post('/treatment', requireAuth, TreatmentController.register);
    apiRoutes.get('/treatments', requireAuth, TreatmentController.getAll);
    apiRoutes.get('/treatment/:id', requireAuth, TreatmentController.getById);

    // User route
    apiRoutes.get('/users', requireAuth, UserController.getAll);
    apiRoutes.get('/user/:id', requireAuth, UserController.getUser);
    apiRoutes.get('/usern/:name', requireAuth, UserController.getUserByName);
    apiRoutes.post('/user/add/:userId', requireAuth, UserController.addUserToUser);
    apiRoutes.post('/user/:userId/addIllness/:illnessId', requireAuth, UserController.addIllness);
    apiRoutes.post('/user/:userId/appendVideo/:videoId', requireAuth, UserController.addVideo);


    // Topic route
    apiRoutes.post('/topic', requireAuth, TopicController.register);
    apiRoutes.get('/topics', requireAuth, TopicController.getAll);
    apiRoutes.get('/topic/:id', requireAuth, TopicController.getById);
    apiRoutes.delete('/topic/delete/:id', requireAuth, TopicController.deleteTopic);

    // Entry route
    apiRoutes.post('/entry/topic', requireAuth, EntryController.register);
    apiRoutes.get('/entries', requireAuth, EntryController.getAll);
    apiRoutes.get('/entry/:id', requireAuth, EntryController.getById);

    //Video route
    apiRoutes.post('/video', requireAuth, upload.single('video'), VideoController.register);
    apiRoutes.get('/video/:title', requireAuth, VideoController.getByTitle);
    apiRoutes.get('/videoById/:id', requireAuth, VideoController.getById);
    apiRoutes.get('/videos', requireAuth, VideoController.getAll);

    // DiaryEntry route
    apiRoutes.post('/diary', requireAuth, DiaryEntryController.register);
    apiRoutes.get('/diaries', requireAuth, DiaryEntryController.getAll);

    app.get('/', requireAuth, function(req, res) {
        res.send('Server is up and Running');
    });

    // Set url for API group routes
    app.use('/api', apiRoutes);
};