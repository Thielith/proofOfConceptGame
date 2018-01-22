var mysql = require('mysql'); 
var io = require('socket.io').listen(33336);
const {exec} = require('child_process');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "p2950",
	database: "felix_database"
})

function pullDBData(){
	var sql = "SELECT * FROM player;"
	con.query(sql, function(err, result){
		if (err) throw err;
		return result;
	})
}

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
		pullDBData()
		console.log(result)
	})
	
	socket.on('start', function(){
		var outcome = "PENALTY"
		
		setTimeout(function(){
			outcome = "P1"
		}, 3000);
		
		setTimeout(function(){
			outcome = "P2"
		}, 3200);
		
		socket.on('shoot', function(){
			if(outcome == "PENALTY"){
				socket.emit(
					'PENALTY', -500
				);
			}
			
			else if(outcome == "P1"){
				var sendLine = ""
				
			}
		})
	})
	
	socket.on('disconnect', function(){
		console.log("Someone From " + clientIp + " disconnected")
	})
});
