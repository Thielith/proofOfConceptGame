var mysql = require('mysql'); 
var io = require('socket.io').listen(33336);
const {exec} = require('child_process');

var delay = 3300

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "alice21",
	database: "felix_database"
})


io.sockets.on('connection', function (socket) {
	var clientIp = socket.request.connection.remoteAddress;
	console.log("Someone From " + clientIp + " Connected")
	
	function sendData(string){
		/*if(string[1] == "check"){
			var sql = "SELECT * FROM player WHERE user_name = '" + string + "'"
			con.query(sql, function(err, result){
				if (err) throw err;
				if(result == ""){
					socket.emit (
						'empty'
					)
				}
				else{
					socket.emit (
						'filledss'
					)
				}
			})
		}
		else{*/
			//string.pop();
			var sql = "SELECT * FROM player WHERE user_name = '" + string + "'"
			con.query(sql, function(err, result){
				if (err) throw err;
				socket.emit (
					'getData', result
				)
			})
		//}
	}
	
	//Edit-Update Database
	socket.on('loadGuys', function (info) {		// 'cmd' is arbitrary
		var sendLine = ""
		sendLine += "'" + info[0] + "' "
		
		for(i = 1; i < info.length - 2; i++){
			sendLine += info[i] + " "
		}
		sendLine += "'" + info[5] + "' "
		sendLine += "'" + info[6] + "' "
		var e = 'python dbExample.py ' + sendLine
		exec(e);
	});
	
	//Update Client Info
	socket.on('sendData', function(string){
		sendData(string)
	})
	
	socket.on('start', function(username){
		var outcome = "PENALTY"
		var sendLine = ""
		var action = false
		
		setTimeout(function(){
			outcome = "P1"
		}, 3000);
		
		setTimeout(function(){
			outcome = "P2"
			if(action == false){
				var sql = "SELECT * FROM player where user_name = '" + username + "';"
				con.query(sql, function(err, result){
					if (err) throw err;
					for(i = result.length - 1; i > -1; i--){
						sendLine += "'" + result[i].player_name + "' "
						sendLine += result[i].accuracy + " "
						sendLine += result[i].speed + " "
						sendLine += result[i].toughness + " "
						sendLine += result[i].score + " "
					}
					sendLine += "'" + username + "'"
					
					var e = 'python game.py ' + sendLine
					exec(e);
					setTimeout(function(){
						sendData(username)
					}, 100)
					action = true
				})
			}
		}, delay);
		
		socket.on('shoot', function(username){
			while(action == false){
				if(outcome == "PENALTY"){
					socket.emit(
						'PENALTY', -500
					);
					setTimeout(function(){
						sendData(username)
					}, 100)
					action = true
				}
				
				else if(outcome == "P1"){
					var sql = "SELECT * FROM player where user_name = '" + username + "';"
					con.query(sql, function(err, result){
						if (err) throw err;
						for(i = 0; i < result.length; i++){
							sendLine += "'" + result[i].player_name + "' "
							sendLine += result[i].accuracy + " "
							sendLine += result[i].speed + " "
							sendLine += result[i].toughness + " "
							sendLine += result[i].score + " "
						}
						sendLine += "'" + username + "'"
						var e = 'python game.py ' + sendLine
						exec(e);
						setTimeout(function(){
							sendData(username)
						}, 500)
					})
					action = true
					delay -= 10
					console.log(delay)
				}
			}
		})
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});
