from base import DBImporter
from pymongo import MongoClient
import mysql.connector
import datetime
from config.config import USERNAME, PASSWORD, HOST, DATABASE_NAME, CITY, UNIVERSITY

class UniversityImporter(DBImporter):

    def __init__(self):
        client = MongoClient()
        mongo_conn = client[DATABASE_NAME]
        mysql_conn = mysql.connector.connect(user=USERNAME, password=PASSWORD, host=HOST, database=DATABASE_NAME)
        super(UniversityImporter, self).__init__(mysql_conn, mongo_conn)
        self.import_data()

    def import_data(self):
        university_data = self.get_sql('Select * from tblatenei')
        current_date = datetime.datetime.now()
        for data in university_data:
            city_obj = {
                "name": data[3],
                "university_campus": data[2],
                "created_date": current_date,
                "last_updated_date": current_date,
                "created_by": ""
            }
            result = self.import_data_in_mongo_single_obj(city_obj, CITY)
            city_id = result.inserted_id
            slug = data[1].lower().replace(" - ","-").replace(" ","-")
            university_obj = {
                "name": data[1],
                "slug": slug,
                "establishment_date": current_date,
                "description": data[4],
                "website": "",
                "city": city_id,
                "image": "",
                "created_date": current_date,
                "last_updated_date": current_date,
                "created_by": "",
                "univ_id": data[0]
            }
            self.import_data_in_mongo_single_obj(university_obj, UNIVERSITY)
