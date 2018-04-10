#	Code for creating tables:
#   create database felix_database;
#	create table player (player_name VARCHAR(16), accuracy INT, speed INT, toughness INT, score INT, user_name VARCHAR(16));
import MySQLdb
import sys


db = MySQLdb.connect(host="localhost",  # your host
                     user="root",  # username
                     passwd="p2950",  # password
                     db="felix_database")  # name of the database
cur = db.cursor()

def insertIntoDatabase(connection,tableName,names,values):
	insertString = "("
	valueString = "("
	i = 0
	for name in names:
		insertString += name +","
		valueString += "'" + str(values[i]) + "'"
		valueString += ","
		i+=1
	insertString = insertString.strip(',')
	valueString = valueString.strip(',')
	insertString += ")"
	valueString += ")"
	sqlCommand = "INSERT INTO " + tableName + " " + insertString + " VALUES " + valueString + ";"
	print(sqlCommand)
	connection.execute(sqlCommand)
	print("commit insert")
	db.commit();
def updateDatabaseData(connection,tableName,collummNames, values):
	collummString = ""
	i = 1
	for name in collummNames:
		collummString += " " + name + " = " + str(values[i])
		collummString += ","
		i+=1
	collummString = collummString.strip(',')
	sqlCommand = "UPDATE " + tableName + " SET" + collummString + " WHERE player_name = '" + values[0] + "' and user_name = '" + values[5] + "';"
	print(sqlCommand)
	connection.execute(sqlCommand)


def addToPlayerDB(connection,player_name,accuracy,speed,toughness,score,user_name):
	names = ["player_name","accuracy","speed","toughness","score","user_name"]
	values = [player_name,accuracy,speed,toughness,score,user_name]
	c = insertIntoDatabase(connection, "player" , names, values)
def updatePlayerFromDB(connection,player_name,accuracy,speed,toughness,score,user_name):
	names = ["accuracy","speed","toughness","score"]
	values = [player_name,accuracy,speed,toughness,score,user_name]
	c = updateDatabaseData(connection, "player" , names, values)


def getDataFromTableByID(connection, table, idName, id):
	#returns a list of all entries matching the id to idName
	sqlCommand = "SELECT * FROM  " + table + " WHERE " + idName + " = '" +  str(id) + "';"
	connection.execute(sqlCommand)
	values = connection.fetchall();
	ret = []
	for v in values:
		ret.append(v)
	print(ret)
	return ret
	

if sys.argv[7] == "add":
	print("adding new player data")
	addToPlayerDB(cur,sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6])
	print("commit update")
	db.commit();
	print("close")
	db.close();
	
elif sys.argv[7] == "update":
	print("updating player data")
	updatePlayerFromDB(cur,sys.argv[1],sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5],sys.argv[6])
	print("commit update")
	db.commit();
	print("close")
	db.close();

#x = getDataFromTableByID(cur,"player","player_name","Billy")


