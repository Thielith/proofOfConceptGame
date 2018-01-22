var mysql = require('mysql'); 
var io = require('socket.io').listen(33336);
const {exec} = require('child_process');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "p2950",
	database: "felix_database"
})
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
	
	//Update Client Info
	socket.on('sendData', function(err){
		if (err) throw err;
		var sql = "SELECT * FROM player;"
		con.query(sql, function(err, result){
			if (err) throw err;
			socket.emit (
				'getData', result
			)
		})
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});
