from base import DBImporter
from pymongo import MongoClient
import mysql.connector
import datetime
from config.config import USERNAME, PASSWORD, HOST, DATABASE_NAME, FACULTY

class FacultyImporter(DBImporter):

    def __init__(self):
        client = MongoClient()
        mongo_conn = client[DATABASE_NAME]
        mysql_conn = mysql.connector.connect(user=USERNAME, password=PASSWORD, host=HOST, database=DATABASE_NAME)
        super(FacultyImporter, self).__init__(mysql_conn,mongo_conn)
        self.import_data()

    def import_data(self):
        faculty_data = self.get_sql('Select * from tblfacolta')
        current_date = datetime.datetime.now()
        faculty_list = []
        for data in faculty_data:
            slug = data[1].lower().replace(" ","-").replace(",","")
            faculty_obj = {
                "title":data[1],
                "slug":slug,
                "subtitle":"",
                "subtitleslug":"",
                "description":data[4],
                "created_date":current_date,
                "last_updated_date":current_date,
                "created_by":"",
                "faculty_id":data[0],
                "image":''
            }
            faculty_list.append(faculty_obj)
        self.import_data_in_mongo(faculty_list, FACULTY)
        return 'Success!'