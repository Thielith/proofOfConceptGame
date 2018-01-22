
var io = require('socket.io').listen(33336);
const {exec} = require('child_process');

 /*
  * SOCKET SETUP
  */
io.sockets.on('connection', function (socket) {
	var clientIp = socket.request.connection.remoteAddress;
	console.log("Someone From " + clientIp + " Connected")
	//Edit-Update Database
	socket.on('loadGuys', function (info) {		// 'cmd' is arbitrary
		var sendLine = ""
		for(i = 0; i < info.length; i++){
			sendLine += info[i] + " "
		}
		var e = 'python dbExample.py ' + sendLine
		console.log(e)
		exec(e);
	});
	
	socket.on('sendData', function(){
		
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});
