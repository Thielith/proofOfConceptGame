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
		console.log("Executing python...")
		var e = 'python dbExample.py ' + sendLine
		exec(e);
		console.log("Python Succsessful!")
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
	
	socket.on('start', function(){
		var outcome = "PENALTY"
		console.log("PENALTY")
		
		setTimeout(function(){
			console.log("P1")
			outcome = "P1"
		}, 3000);
		
		setTimeout(function(){
			console.log("P2")
			outcome = "P2"
		}, 3300);
		
		socket.on('shoot', function(){
			if(outcome == "PeNALTY"){
				console.log("PENALTY")
				socket.emit(
					'PENALTY', -500
				);
			}
			
			else if(outcome == "P1"){
				console.log("Player 1")
				var sendLine = ""
				var sql = "SELECT * FROM player;"
				con.query(sql, function(err, result){
					if (err) throw err;
					for(i = 0; i < result.length; i++){
						sendLine += "'" + result[i].player_name + "' "
						sendLine += result[i].accuracy + " "
						sendLine += result[i].speed + " "
						sendLine += result[i].toughness + " "
						sendLine += result[i].score + " "
					}
					var e = 'python game.py ' + sendLine
					exec(e);
				})
			}
		})
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});
