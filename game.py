import time
import random
import sys
from dbExample import updateDatabaseData
from dbExample import updatePlayerFromDB
import MySQLdb

db = MySQLdb.connect(host="localhost",  # your host
                     user="root",  # username
                     passwd="p2950",  # password
                     db="felix_database")  # name of the database
cur = db.cursor()

#              Name, Accuraccy, Speed, Toughness, Score
playerStats = ['Billy', 100, 50, 3, 0]
enemyStats = ['Chilly', 50, 70, 5, 0]


class player:
    def __init__(self, name, accuracy, speed, toughness, score, user_name):
        self.name = name
        self.accuracy = accuracy
        self.speed = speed
        self.toughness = toughness
        self.score = score
        self.username = user_name


def fight(self, enemy):
    sFinalAccuracy = random.randint(int(self.accuracy), 100)

    eFinalSpeed = random.randint(int(enemy.speed), 100)
    eFinalToughness = random.randint(int(enemy.toughness), 10)

    def calcScore(self, enemy):
        hitLocation = random.randint(sFinalAccuracy, sFinalAccuracy * 4)
        if hitLocation >= 100 and hitLocation < 200:
            print(self.name + " missed.")
        elif hitLocation >= 200 and hitLocation < 300:
            self.score = int(self.score) + 100
            self.score -= random.randint(eFinalToughness, eFinalToughness * 2)
            print(self.name + " hit an arm.")
        elif hitLocation >= 300 and hitLocation < 400:
            self.score = int(self.score) + 500
            self.score -= random.randint(eFinalToughness, eFinalToughness * 2)
            print(self.name + " hit the chest.")
        elif hitLocation == 400:
            self.score = int(self.score) + 1000
            self.score -= random.randint(eFinalToughness, eFinalToughness * 2)
            print(self.name + " got a HEADSHOT.")

        if self.score < 0:
            self.score = 0
        print("Score: " + str(self.score))
        print(self.username)

        updatePlayerFromDB(cur, self.name, self.accuracy, self.speed, self.toughness, self.score, self.username)
        print("commit update")
        db.commit();
        print("close")
        db.close();

    calcScore(self, enemy)


p = player(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5], sys.argv[11])
e = player(sys.argv[6], sys.argv[7], sys.argv[8], sys.argv[9], sys.argv[10], sys.argv[11])

fight(p, e)
