var express = require('express');
var router = express.Router();
const {
    Pool
} = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: connectionString
});

//Get all users
router.get('/admin', getContentList);

//Insert new user
//router.post('/api/content', insertContent);

//Get single user
router.get('/api/content', getContent);

//Update user
//router.put('/api/content', setContent);

//Delete user
//router.delete('/api/content', deleteContent);

//router.post('/checkLogin', checkLogin);

module.exports = router;

//CONTROLLER
//Get all users
function getContentList(request, response) {

    getContentListDb(function (error, result) {

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
//function insertContent(request, response) {
//    var params = [request.query.username,
//                  request.query.first_name,
//                  request.query.last_name];
//
//    InsertContentDb(params, function (error, result) {
//
//        if (error || result == null || result.length != 1) {
//            response.status(500).json({
//                success: false,
//                data: error
//            });
//        } else {
//            response.status(200).json(result);
//        }
//    });
//}

//Get single user
function getContent(request, response) {
    var location = [request.query.location];

    getContentDb(location, function (error, result) {

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
//function setContent(request, response) {
//    var params = [request.query.id,
//                  request.query.username,
//                  request.query.first_name,
//                  request.query.last_name];
//
//    updateContentDb(params, function (error, result) {
//
//        if (error || result == null || result.length != 1) {
//            response.status(500).json({
//                success: false,
//                data: error
//            });
//        } else {
//            response.status(200).json(result);
//        }
//    });
//}

//Delete user
//function deleteContent(request, response) {
//    const id = request.query.id;
//
//    deleteContentDb(id, function (error, result) {
//
//        if (error || result == null || result.length != 1) {
//            response.status(500).json({
//                success: false,
//                data: error
//            });
//        } else {
//            response.status(200).json(result);
//        }
//    });
//}

//function checkLogin(request, response) {
//    const username = request.body.username;
//    const password = request.body.password;
//
//    getPasswordDb(username, function (error, result) {
//
//        if (error || result == null || result.length != 1) {
//            response.status(500).json({
//                success: false,
//                data: error
//            });
//        } else {
//            response.status(200).json({
//                succes: true
//            });
//            //            request.session.user = username;
//            //            request.redirect('/users');
//        }
//    });
//}

//MODEL
//Get all content
function getContentListDb(callback) {
    console.log("Getting all users from DB");

    const sql = "SELECT c.id, c.name, c.value, l.name FROM content c LEFT JOIN content_location l ON c.id = l.id";


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

//Insert new user TODO
//function InsertContentDb(params, callback) {
//    console.log("Insert new user");
//
//    const sql = "INSERT INTO users (username, first_name, last_name) VALUES ($1, $2, $3)";
//
//    //	const params = [];
//
//    pool.query(sql, params, function (err, result) {
//        if (err) {
//            console.log("Error in query: ")
//            console.log(err);
//            callback(err, null);
//        }
//
//        // Log this to the console for debugging purposes.
//        console.log("Found result: " + JSON.stringify(result.rows));
//
//
//        callback(null, result.rows);
//    });
//
//}

//Get single user
function getContentDb(params, callback) {
    console.log("Getting content from DB");

    const sql = "SELECT c.id, c.name, c.value, l.name FROM content c LEFT JOIN content_location l ON c.id = l.id WHERE l.name = $1";

    //const params = [location];
    
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
//function updateContentDb(params, callback) {
//    console.log("Getting all users from DB");
//
//    const sql = "UPDATE users SET username = $2, first_name = $3, last_name = $4 WHERE id = $1::int";
//
//    pool.query(sql, params, function (err, result) {
//        if (err) {
//            console.log("Error in query: ")
//            console.log(err);
//            callback(err, null);
//        }
//
//        // Log this to the console for debugging purposes.
//        console.log("Found result: " + JSON.stringify(result.rows));
//
//
//        callback(null, result.rows);
//    });
//
//}

//Delete user
//function deleteContentDb(id, callback) {
//    console.log("Getting all users from DB");
//
//    const sql = "DELETE FROM users WHERE id = $1::int";
//
//    const params = [id];
//
//    pool.query(sql, params, function (err, result) {
//        if (err) {
//            console.log("Error in query: ")
//            console.log(err);
//            callback(err, null);
//        }
//
//        // Log this to the console for debugging purposes.
//        console.log("Found result: " + JSON.stringify(result.rows));
//
//
//        callback(null, result.rows);
//    });
//
//}

//Get user password
//function getPasswordDb(username, callback) {
//    console.log("Getting user " + username + " from DB");
//
//    const sql = "SELECT id, username, password FROM users WHERE username = $1";
//
//    const params = [username];
//
//    pool.query(sql, params, function (err, result) {
//        if (err) {
//            console.log("Error in query: ")
//            console.log(err);
//            callback(err, null);
//        }
//
//        // Log this to the console for debugging purposes.
//        console.log("Found result: " + JSON.stringify(result.rows));
//
//
//        callback(null, result.rows);
//    });
//
//}