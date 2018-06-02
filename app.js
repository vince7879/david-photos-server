const express = require('express')
const app = express()
const config = require('./config');
var bodyParser = require('body-parser')
var cors = require('cors');

// var colorsQuery = require('./population/colors')
// var userQuery = require('./population/user')
// var picQuery = require('./population/pictures')

// var db = require('./models');
// db.sequelize.sync({force:true})
// 	.then(result =>{
//  		return db.sequelize.query(colorsQuery);
//  	})
//  	.then(result =>{
//  		return db.sequelize.query(userQuery);
//  	})
//  	.then(result =>{
//  		return db.sequelize.query(picQuery);
//  	});

// cors
app.use(cors());

app.use(express.static('uploads'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var indexRoute = require('./routes/indexRoute');
var colorRoute = require('./routes/colorRoute');
var userRoute = require('./routes/userRoute');
var pictureRoute = require('./routes/pictureRoute');
app.use('/', indexRoute);
app.use('/colors', colorRoute);
app.use('/user', userRoute);
app.use('/pictures', pictureRoute);

app.listen(process.env.serverPort, function() {
    console.log('Listening on port ' +process.env.serverPort);
});