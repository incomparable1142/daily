import mysql.connector
from pymongo import MongoClient

USERNAME = 'root'
PASSWORD = '123'
HOST='localhost'
DATABASE_NAME='quaestiones'
PORT= '3306'

#################################
#                               #
#        MONGO COLLECTION       #
#                               #
#################################

# tables

EXAM = 'exam'
FACULTY = 'faculty'
LECTURER = 'lecturer'
BANNER = 'banner'
CITY = 'city'
UNIVERSITY = 'university'

MYSQL_CONNECTION = mysql.connector.connect(user=USERNAME, password=PASSWORD, host=HOST, database=DATABASE_NAME)
client = MongoClient()
MONGO_CONNECTION = client[DATABASE_NAME]