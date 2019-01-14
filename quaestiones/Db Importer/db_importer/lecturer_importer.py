from base import DBImporter
from pymongo import MongoClient
import mysql.connector
import datetime
from config.config import USERNAME, PASSWORD, HOST, DATABASE_NAME, LECTURER

class LecturerImporter(DBImporter):

    def __init__(self):
        client = MongoClient()
        mongo_conn = client[DATABASE_NAME]
        mysql_conn = mysql.connector.connect(user=USERNAME, password=PASSWORD, host=HOST, database=DATABASE_NAME)
        super(LecturerImporter,self).__init__(mysql_conn,mongo_conn)
        self.import_data()

    def import_data(self):
        lecturer_data = self.get_sql('Select * from tbldocenti')
        current_date = datetime.datetime.now()
        lectuter_list = []
        for data in lecturer_data:
            lecturer_obj = {
                "firstname": data[1],
                "lastname": data[2],
                "name": data[1] + " " + data[2],
                "created_date": current_date,
                "last_updated_date": current_date,
                "created_by": ""
            }
            lectuter_list.append(lecturer_obj)
        self.import_data_in_mongo(lectuter_list, LECTURER)
        return 'Success!'
