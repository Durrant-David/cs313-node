const express = require('express')
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'admin';
const app = express();
const router = express.Router();
const path = require('path');
const env = require('dotenv').config();
const PORT = process.env.PORT || 5000
const {
    Pool
} = require("pg");
const connectionString = process.env.DATABASE_URL;
//const postal = require('./models/postalRate');
const pool = new Pool({
    connectionString: connectionString
});
//var routes = require('./routes/index');
var content = require('./routes/content/index');
var users = require('./routes/users');
var admin = require('./routes/admin/index');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
//app.use('/', routes);
app.use('/', content);
//app.use('/', admin);
app.get('/', (req, res) => res.render('pages/index'));

app.post('/checklogin', async (req, res) => {
    var username = req.body.username,
        password = req.body.password;

    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM users WHERE username = '${username}'`);
        const user = (result) ? result.rows[0] : null;


        bcrypt.hash(myPlaintextPassword, saltRounds, async function (err, hash) {
            console.log(hash);
        });


        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.username = username;
            res.json({
                success: true
            });
        } else {
            res.json({
                success: false
            });
        }
    } catch (err) {
        console.log("Login error");
        console.log(err);
        res.json({
            error: err
        });
    }
});

// create the logout post route
app.post('/logout', (req, res) => {
    if (req.session.username) {
        req.session.destroy();
        res.json({
            success: true
        });
    } else {
        res.json({
            success: false
        });
    }
});

// create route for server time
app.get('/admin', verifyLogin);
app.get('/admin', (req, res) => res.render('pages/admin'));

app.get('/content', verifyLogin);
app.get('/content', (req, res) => res.render('pages/content'));

//app.use('/', (req, res) => res.render('pages/index.ejs'));
app.use('/login', (req, res) => res.render('pages/login'));
//app.use('/user', (req, res) => res.render('pages/user'));
//app.use('/users', (req, res) => res.render('pages/users'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.get('/', (req, res) => res.render('pages/index'));
//app.get('/postal_rate', postal.handlePostal);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

function verifyLogin(req, res, next) {
    if (req.session.username) {
        next();
    } else {
    res.redirect('/login');
    }
}
