const express = require('express')
const app = express();
const path = require('path')
const PORT = process.env.PORT || 5000


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));
app.get('/postal_rate', handlePostal);
app.listen(PORT, () => console.log(`Listening on ${ PORT }`));

function handlePostal(req, res) {
	const weight = Number(req.query.weight);
	const type = Number(req.query.type);
	const zone = Number(req.query.zone);
    
    computePostal(res, weight, type, zone);
}

function computePostal(res, weight, type, zone) {
    let price = 0;
    let typeName;
    switch(type) {
        case 0:
            price = lettersStamped(weight);
            typeName = "Letters (Stamped)";
            break;
        case 1:
            price = lettersMetered(weight);
            typeName = "Letters (Metered)";
            break;
        case 2:
            price = largeEnvelopes(weight);
            typeName = "Large Envelopes (Flats)";
            break;
        case 3:
            weight = Math.ceil(weight);
            price = firstClassPackageServiceRetail[weight][zone];
            typeName = "First-Class Package Service—Retail";
            break;
        default:
            console.info("No type selected");
            break;
    }
    
    const params = {weight: weight, type: typeName, price: price};
    
	res.render('pages/postalRate', params);
}

function lettersStamped(weight) {
    let price = 0;
    if (weight <= 0) {
        console.error("Not a valid weight");
    } else if (weight <= 1) {
        price = 0.55;
    } else if (weight <= 2) {
        price = 0.70;
    } else if (weight <= 3) {
        price = 0.85;
    } else if (weight <= 3.5) {
        price = 1.00;
    }
    
    return price;
}

function lettersMetered(weight) {
    let price = 0;
    if (weight <= 0) {
        console.error("Not a valid weight");
    } else if (weight <= 1) {
        price = 0.50;
    } else if (weight <= 2) {
        price = 0.65;
    } else if (weight <= 3) {
        price = 0.80;
    } else if (weight <= 3.5) {
        price = 0.95;
    }
    
    return price;
}

function largeEnvelopes(weight) {
    let price = 0;
    if (weight <= 0) {
        console.error("Not a valid weight");
    } else if (weight <= 1) {
        price = 1.00;
    } else if (weight <= 2) {
        price = 1.15;
    } else if (weight <= 3) {
        price = 1.30;
    } else if (weight <= 4) {
        price = 1.45;
    } else if (weight <= 5) {
        price = 1.60;
    } else if (weight <= 6) {
        price = 1.75;
    } else if (weight <= 7) {
        price = 1.90;
    } else if (weight <= 8) {
        price = 2.05;
    } else if (weight <= 9) {
        price = 2.20;
    } else if (weight <= 10) {
        price = 2.35;
    } else if (weight <= 11) {
        price = 2.50;
    } else if (weight <= 12) {
        price = 2.65;
    } else if (weight <= 13) {
        price = 2.80;
    }
    
    return price;
}

var firstClassPackageServiceRetail = {
    1: {
        1: 3.66,
        2: 3.66,
        3: 3.70,
        4: 3.74,
        5: 3.78,
        6: 3.82,
        7: 3.94,
        8: 4.06,
        9: 4.06
    },
    2: {
        1: 3.66,
        2: 3.66,
        3: 3.70,
        4: 3.74,
        5: 3.78,
        6: 3.82,
        7: 3.94,
        8: 4.06,
        9: 4.06
    },
    3: {
        1: 3.66,
        2: 3.66,
        3: 3.70,
        4: 3.74,
        5: 3.78,
        6: 3.82,
        7: 3.94,
        8: 4.06,
        9: 4.06
    },
    4: {
        1: 3.66,
        2: 3.66,
        3: 3.70,
        4: 3.74,
        5: 3.78,
        6: 3.82,
        7: 3.94,
        8: 4.06,
        9: 4.06
    },
    5: {
        1: 4.39,
        2: 4.39,
        3: 4.44,
        4: 4.49,
        5: 4.53,
        6: 4.57,
        7: 4.69,
        8: 4.81,
        9: 4.81
    },
    6: {
        1: 4.39,
        2: 4.39,
        3: 4.44,
        4: 4.49,
        5: 4.53,
        6: 4.57,
        7: 4.69,
        8: 4.81,
        9: 4.81
    },
    7: {
        1: 4.39,
        2: 4.39,
        3: 4.44,
        4: 4.49,
        5: 4.53,
        6: 4.57,
        7: 4.69,
        8: 4.81,
        9: 4.81
    },
    8: {
        1: 4.39,
        2: 4.39,
        3: 4.44,
        4: 4.49,
        5: 4.53,
        6: 4.57,
        7: 4.69,
        8: 4.81,
        9: 4.81
    },
    9: {
        1: 5.19,
        2: 5.19,
        3: 5.24,
        4: 5.30,
        5: 5.35,
        6: 5.40,
        7: 5.53,
        8: 5.66,
        9: 5.66
    },
    10: {
        1: 5.19,
        2: 5.19,
        3: 5.24,
        4: 5.30,
        5: 5.35,
        6: 5.40,
        7: 5.53,
        8: 5.66,
        9: 5.66
    },
    11: {
        1: 5.19,
        2: 5.19,
        3: 5.24,
        4: 5.30,
        5: 5.35,
        6: 5.40,
        7: 5.53,
        8: 5.66,
        9: 5.66
    },
    12: {
        1: 5.19,
        2: 5.19,
        3: 5.24,
        4: 5.30,
        5: 5.35,
        6: 5.40,
        7: 5.53,
        8: 5.66,
        9: 5.66
    },
    13: {
        1: 5.71,
        2: 5.71,
        3: 5.78,
        4: 5.85,
        5: 5.93,
        6: 5.99,
        7: 6.13,
        8: 6.27,
        9: 6.27
    },
}