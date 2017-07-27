let _io = require('socket.io');
let DB = require('./DB');
let db = new DB();

module.exports = function channel(server) {
    let io = _io(server);

    // channel
    io.on('connection', (socket) => {
        // listen for join room
        socket.on('join room', (data) => {
            // Load message
            db.LoadMsg([data.room], (err, result) => {
                if (err) throw err;
                socket.emit('load msg', result);            
            });
            socket.join(data.room);
        });

        // listen for leave room
        socket.on('leave room', (data) => {
            socket.leave(data.room);
        });

        // listen for user send message
        socket.on('send msg', (data) => {
            data.time = new Date();
            socket.in(data.room).emit('broadcast msg', data);
            socket.emit('broadcast msg', data);
            // save to DB
            let obj = { roomID: data.room, account: data.account, message: data.message, time: data.time };
            db.Insert('Channel', obj, (err, result) => {
                if (err) throw err;
            });
        });
    });
}