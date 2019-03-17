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
var users = require('./routes/users');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routes);
app.use('/login', (req, res) => res.render('pages/login'));
app.use('/user', (req, res) => res.render('pages/user'));
app.use('/users', (req, res) => res.render('pages/users'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.get('/', (req, res) => res.render('pages/index'));
//app.get('/postal_rate', postal.handlePostal);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

//router.post('/checkLogin', checkLogin);
//function checkLogin(request, response) {
//	const username = request.query.username;
//	const password = request.query.password;
//
//	getPasswordDb(username, function(error, result) {
//        
//		if (error || result == null || result.length != 1) {
//			response.status(500).json({success: false, data: error});
//		} else {
//			console.log(result[0].password);
//		}
//	});
//}
//
////Get single user
//function getPasswordDb(username, callback) {
//	console.log("Getting user " + username + " from DB");
//
//	const sql = "SELECT id, username, password FROM users WHERE username = $1";
//
//	const params = [username];
//
//	pool.query(sql, params, function(err, result) {
//		if (err) {
//			console.log("Error in query: ")
//			console.log(err);
//			callback(err, null);
//		}
//
//		// Log this to the console for debugging purposes.
//		console.log("Found result: " + JSON.stringify(result.rows));
//
//
//		callback(null, result.rows);
//	});
//
//} 