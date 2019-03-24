const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const router = express.Router();
const path = require('path');
const env = require('dotenv').config();
const passwordHash = require('password-hash');
const PORT = process.env.PORT || 5000
const { Pool } = require("pg");
const connectionString = process.env.DATABASE_URL;
//const postal = require('./models/postalRate');
const pool = new Pool({connectionString: connectionString});
var routes = require('./routes/index');
var content = require('./routes/content/index');
var users = require('./routes/users');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes);
app.use('/', content);
//app.use('/', (req, res) => res.render('pages/index.ejs'));
app.use('/login', (req, res) => res.render('pages/login'));
app.use('/user', (req, res) => res.render('pages/user'));
app.use('/users', (req, res) => res.render('pages/users'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.get('/', (req, res) => res.render('pages/index'));
//app.get('/postal_rate', postal.handlePostal);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

