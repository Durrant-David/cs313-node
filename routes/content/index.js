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
router.get('/api/contentList', getContentList);

//Insert new user
//router.post('/api/content', insertContent);

//Get single user
router.get('/api/content', getContent);

//Update user
router.put('/api/content', verifyLogin);
router.put('/api/content', setContent);

//Delete user
//router.delete('/api/content', deleteContent);

//router.post('/checkLogin', checkLogin);

module.exports = router;

//CONTROLLER
function verifyLogin(req, res, next) {
    if (req.session.username) {
        next();
    } else {
        console.log("Access resticted");
    }
}

//Get all users
function getContentList(request, response) {

    getContentListDb(function (error, result) {

        console.log(result);
        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json({
                success: true,
                data: result
            });
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
    var params = [];
    console.log(isNaN(request.query.id));
    if (isNaN(request.query.id)) { //if(request.query.id === parseInt(request.query.id, 10)) {
        params[0] = request.query.location;
    } else {
        params[0] = request.query.id;
    }
    console.log(params[0]);
    getContentDb(params, function (error, result) {

        console.log(result);
        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json({
                success: true,
                data: result
            });
        }
    });
}

//Update user
function setContent(request, response) {
    var params = [request.body.id,
                  request.body.value];

    updateContentDb(params, function (error, result) {

        console.log(params);
        if (error || result == null) {
            response.status(500).json({
                success: false,
                data: error
            });
        } else {
            response.status(200).json({
                success: true,
                data: result
            });
        }
    });
}

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
    console.log("Getting all content from DB");

    const sql = "SELECT c.id, c.name, c.value, l.name FROM content c inner JOIN content_location l ON c.location_id = l.id";


    pool.query(sql, function (err, result) {
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
    var sql;
    if (isNaN(params[0])) {
        console.log("finding by location");
        sql = "SELECT c.id, c.name, c.value, l.name FROM content c inner JOIN content_location l ON c.location_id = l.id WHERE l.name = $1";
    } else {
        console.log("finding by id");
        sql = "SELECT c.id, c.name, c.value, l.name FROM content c inner JOIN content_location l ON c.location_id = l.id WHERE c.id = $1::int";
    }

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
function updateContentDb(params, callback) {
    console.log("Getting all users from DB");

    const sql = "UPDATE content SET value = $2 WHERE id = $1::int";

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
