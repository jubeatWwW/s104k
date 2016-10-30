'use strict';
const jwt = require('jsonwebtoken');
const express = require('express');

const helmet = require('helmet');
const multer = require('multer');
const bodyParser = require('body-parser');
let upload  = multer();
let app = express();
let server = require('http').createServer(app);
let port = process.env.PORT || 8787;

let Channel = require('./Channel.js');
Channel(server);

let User = require('./User');
let user = new User();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", 'GET, PUT, POST, DELETE');
    res.header("Access-Control-Allow-Headers", "*");
    next();
});
app.post('/', (req, res)=>{
    res.send("RR");
});

app.post('/register', upload.array(), (req, res)=>{
    user.Register(req.body, (err, result)=>{
        if(err) {
            res.send(err);
        }
        res.send(result);
    });      
});

app.post('/login', upload.array(), (req, res)=>{
    user.Login(req.body, (err, result)=>{
        if(err)
            res.send(err);
        else
            res.send(result);
    });      
});

app.post('/rate', upload.array(), (req, res)=>{
    if(req.body.id && req.body.score){
        user.Rate(req.body.id, req.body.score, (err, result)=>{
            if(err)
                res.send(err);
            else
                res.send(result);
        });
    } else {
        res.send({err: "lack of id or score"});
    }
});

app.get('/rate', upload.array(), (req, res)=>{
    user.GetRate(req.query.id, (result)=>{
        res.send(result);
    });
});

app.get('/user', (req, res)=>{
    user.GetUserInfo(req.get('Authorization'), (err, result)=>{
        if(err)
            res.send(err);
        else
            res.send(result);
    });
});

app.post('/kw', upload.array(), (req, res)=> {

});

server.listen(port, ()=>{
    console.log('Server listening on %d', port);
});
