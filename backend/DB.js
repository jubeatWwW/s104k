let mysql = require('mysql');
let config = require('./DB.config');
class DB {
    constructor(){
        this.config = config;
        this.secret = 'meowmoewwoofwoof';
    }

    Insert(table, obj, cb){
        let connection = mysql.createConnection(this.config);
        connection.connect();
        connection.query("INSERT INTO ?? SET ?", [table, obj], (err, result)=>{
            console.log(result);
            connection.destroy();
            cb(err, result);
        });
    }

    Select(table, where, cb){
        let connection = mysql.createConnection(this.config);
        connection.connect();
        if(where){
            connection.query("SELECT * FROM ?? WHERE ?", [table, where], (err, result)=>{
                console.log(result);
                connection.destroy();
                cb(err, result);
            });
        } else {
            connection.query("SELECT * FROM ??", [table], (err, result)=>{
                console.log(result);
                connection.destroy();
                cb(err, result);
            });
        }
    }

    LoadMsg(room, cb){
        let connection = mysql.createConnection(this.config);
        connection.connect();
        connection.query("SELECT * FROM (SELECT * FROM Channel WHERE roomID = ? ORDER BY time DESC LIMIT 30) AS Msg ORDER BY time", [room], (err, result)=>{
            console.log(result);
            connection.destroy();
            cb(err, result);
        });
    }

    _Login(info, cb){
        let connection = mysql.createConnection(this.config);
        connection.connect();
        connection.query("SELECT * FROM User WHERE account = ? AND password = ?",
            [info.account, info.password], (err, result)=>{
            console.log(result);
            connection.destroy();
            cb(err, result);
        });

    }

    _Rate(id, score, cb){
        this.Select('User', {id}, (err, result)=>{
            if(result.length == 1){
                let totalScore = result[0].score + parseInt(score);
                let totalCnt = result[0].scoreCnt + 1;
                let connection = mysql.createConnection(this.config);
                connection.connect();
                connection.query("UPDATE User SET ? WHERE ?",
                    [{score: totalScore, scoreCnt: totalCnt}, {id}], (err, result)=>{
                    console.log(result);
                    connection.destroy();
                    cb(err, result);
                });
            } else {
                cb({err:"id not found"}, null);
            }
        });
    }

    _RateJob(id, score, cb){
        this.Select('Jobs', {id}, (err, result)=>{
            if(result.length == 1){
                let totalScore = result[0].score + parseInt(score);
                let totalCnt = result[0].scoreCnt + 1;
                let connection = mysql.createConnection(this.config);
                connection.connect();
                connection.query("UPDATE Jobs SET ? WHERE ?",
                    [{score: totalScore, scoreCnt: totalCnt}, {id}], (err, result)=>{
                    console.log(result);
                    connection.destroy();
                    cb(err, result);
                });
            } else {
                cb({err:"id not found"}, null);
            }
        });
    }

    _GetRate(id, cb){
        if(id){
            this.Select('User', {id}, (err, result)=>{
                if(result.length == 1){
                    cb({id: result[0].id, score: result[0].score/result[0].scoreCnt});
                } else {
                    cb({err: "id not found"});
                }
            });
        } else {
            this.Select('User', null, (err, result) => {
                let scores = [];
                result.map( (n) => {
                    scores.push({id: n.id, score: n.score/n.scoreCnt});
                });
                cb(scores);
            });
        }
    }

    _GetJob(id, cb){
        if(id){
            this.Select('Jobs', {id}, (err, result)=>{
                if(result.length == 1){
                    cb(result[0]);
                } else {
                    cb({err: "id not found"});
                }
            });
        } else {
            this.Select('Jobs', null, (err, result) => {
                cb(result);
            });
        }
    }
    
    _GetJobRate(id, cb){
        if(id){
            this.Select('Jobs', {id}, (err, result)=>{
                if(result.length == 1){
                    cb({id: result[0].id, score: result[0].score/result[0].scoreCnt});
                } else {
                    cb({err: "id not found"});
                }
            });
        } else {
            this.Select('Jobs', null, (err, result) => {
                let scores = [];
                result.map( (n) => {
                    scores.push({id: n.id, score: n.score/n.scoreCnt});
                });
                cb(scores);
            });
        }
    }

    _Subecribe(id, subscriberId, cb){

        let obj = {"employer_id" : id, "subscriber_id" : subscriberId};
        if (id && subscriberId) {
            this.Insert('Subscribe', obj , (err, result) => {
                cb(err, result);
            } );
        }
        else {
            cb({err : "something null"});
        }
    }

    _Feedback(userId, message, time, cb) {
        
        let obj = {"userId" : userId, "message" : message, "time" : time};
        this.Insert('Feedback', obj, (err, result) => {
            cb(err, result);
        });
      }
}

module.exports = DB;
