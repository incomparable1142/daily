from base import DBImporter
from pymongo import MongoClient
import mysql.connector
import datetime
from config.config import MONGO_CONNECTION, BANNER, MYSQL_CONNECTION, EXAM, \
    FACULTY, LECTURER, CITY, UNIVERSITY

class MethodImporter(DBImporter):
    def __init__(self):
        client = MongoClient()
        mongo_conn = MONGO_CONNECTION
        mysql_conn = MYSQL_CONNECTION
        super(MethodImporter, self).__init__(mysql_conn, mongo_conn)
        self.import_banner_data()
        self.import_exam_data()
        self.import_faculty_data()
        self.import_lecturer_data()
        self.import_university_data()

    def import_banner_data(self):
        banner_data = self.get_sql('Select * from banner')
        current_date = datetime.datetime.now()
        banner_list = []
        for data in banner_data:
            banner_obj = {
                "code": data[1],
                "desciption": data[3],
                "status": "Disabled",
                "path": data[4],
                "position": data[5],
                "created_date": current_date,
                "last_updated_date": current_date,
                "created_by": "",
                "banner_id": data[0]
            }
            banner_list.append(banner_obj)
        self.import_data_in_mongo(banner_list, BANNER)

    def import_exam_data(self):
        exam_data = self.get_sql('Select * from tblesami')
        current_date = datetime.datetime.now()
        exam_list = []
        for data in exam_data:
            exam_obj = {
                "name": data[1],
                "created_date": current_date,
                "last_updated_date": current_date,
                "created_by": "",
                "exam_id": data[0]
            }
            exam_list.append(exam_obj)
        self.import_data_in_mongo(exam_list, EXAM)

    def import_faculty_data(self):
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

    def import_lecturer_data(self):
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

    def import_university_data(self):
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

