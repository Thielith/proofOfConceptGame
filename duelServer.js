var mysql = require('mysql'); 
var io = require('socket.io').listen(33336);
const {exec} = require('child_process');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "p2950",
	database: "felix_database"
})


io.sockets.on('connection', function (socket) {
	var clientIp = socket.request.connection.remoteAddress;
	console.log("Someone From " + clientIp + " Connected")
	
	function sendData(){
		var sql = "SELECT * FROM player;"
		con.query(sql, function(err, result){
			if (err) throw err;
			socket.emit (
				'getData', result
			)
		})
	}
	
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
		sendData()
	})
	
	socket.on('start', function(){
		var outcome = "PENALTY"
		var sendLine = ""
		var action = false
		
		setTimeout(function(){
			outcome = "P1"
		}, 3000);
		
		setTimeout(function(){
			outcome = "P2"
			if(action == false){
				var sql = "SELECT * FROM player;"
				con.query(sql, function(err, result){
					if (err) throw err;
					for(i = result.length - 1; i > -1; i--){
						sendLine += "'" + result[i].player_name + "' "
						sendLine += result[i].accuracy + " "
						sendLine += result[i].speed + " "
						sendLine += result[i].toughness + " "
						sendLine += result[i].score + " "
					}
					var e = 'python game.py ' + sendLine
					exec(e);
					setTimeout(function(){
						sendData()
					}, 100)
					action = true
				})
			}
		}, 3300);
		
		socket.on('shoot', function(){
			while(action == false){
				if(outcome == "PENALTY"){
					socket.emit(
						'PENALTY', -500
					);
					setTimeout(function(){
						sendData()
					}, 100)
					action = true
				}
				
				else if(outcome == "P1"){
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
						setTimeout(function(){
							sendData()
						}, 100)
					})
					action = true
				}
			}
		})
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});
