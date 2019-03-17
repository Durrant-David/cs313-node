var express = require('express');
var router = express.Router();
var session = require('client-sessions');
console.log("router/index")
//pg config
const {
    Pool
} = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: connectionString
});

//Get all users
router.get('api/users', getUsers);

//Insert new user
router.post('api/user', insertUser);

//Get single user
router.get('api/user', getUser);

//Update user
router.put('api/user', setUser);

//Delete user
router.delete('api/user', deleteUser);

router.post('/checkLogin', checkLogin);

//CONTROLLER
//Get all users
function getUsers(request, response) {

    getUsersDb(function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json(result);
        }
    });
}

//Insert new user
function insertUser(request, response) {
    var params = [request.query.username,
                  request.query.first_name,
                  request.query.last_name];

    InsertUserDb(params, function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json(result);
        }
    });
}

//Get single user
function getUser(request, response) {
    const id = request.query.id;

    getUserDb(id, function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json(result[0]);
        }
    });
}

//Update user
function setUser(request, response) {
    var params = [request.query.id,
                  request.query.username,
                  request.query.first_name,
                  request.query.last_name];

    updateUserDb(params, function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json(result);
        }
    });
}

//Delete user
function deleteUser(request, response) {
    const id = request.query.id;

    deleteUserDb(id, function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json(result);
        }
    });
}

function checkLogin(request, response) {
    const username = request.body.username;
    const password = request.body.password;

    getPasswordDb(username, function (error, result) {

        if (error || result == null || result.length != 1) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json({ succes: true });
//            request.session.user = username;
//            request.redirect('/users');
        }
    });
}

//MODEL
//Get all users
function getUsersDb(callback) {
    console.log("Getting all users from DB");

    const sql = "SELECT id, username, first_name, last_name FROM users";


    pool.query(sql, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));


        callback(result.rows);
    });

}

//Insert new user
function InsertUserDb(params, callback) {
    console.log("Insert new user");

    const sql = "INSERT INTO users (username, first_name, last_name) VALUES ($1, $2, $3)";

    //	const params = [];

    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));


        callback(null, result.rows);
    });

}

//Get single user
function getUserDb(id, callback) {
    console.log("Getting all users from DB");

    const sql = "SELECT id, username, first_name, last_name FROM users WHERE id = $1::int";

    const params = [id];

    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));

        callback(null, result.rows);
    });

}

//Update user
function updateUserDb(params, callback) {
    console.log("Getting all users from DB");

    const sql = "UPDATE users SET username = $2, first_name = $3, last_name = $4 WHERE id = $1::int";

    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));


        callback(null, result.rows);
    });

}

//Delete user
function deleteUserDb(id, callback) {
    console.log("Getting all users from DB");

    const sql = "DELETE FROM users WHERE id = $1::int";

    const params = [id];

    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));


        callback(null, result.rows);
    });

}

//Get user password
function getPasswordDb(username, callback) {
    console.log("Getting user " + username + " from DB");

    const sql = "SELECT id, username, password FROM users WHERE username = $1";

    const params = [username];

    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log("Error in query: ")
            console.log(err);
            callback(err, null);
        }

        // Log this to the console for debugging purposes.
        console.log("Found result: " + JSON.stringify(result.rows));


        callback(null, result.rows);
    });

}
module.exports = router;
