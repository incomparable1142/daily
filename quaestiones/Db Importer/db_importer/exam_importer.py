from base import DBImporter
from pymongo import MongoClient
import mysql.connector
import datetime
from config.config import USERNAME, PASSWORD, HOST, DATABASE_NAME, EXAM


class ExamImporter(DBImporter):

	def __init__(self):
		client = MongoClient()
		mongo_conn = client[DATABASE_NAME]
		mysql_conn = mysql.connector.connect(user=USERNAME,
											 password=PASSWORD,
											 host=HOST, database=DATABASE_NAME)
		super(ExamImporter, self).__init__(mysql_conn, mongo_conn)
		self.import_data()

	def import_data(self):
		exam_data = self.get_sql('Select * from tblesami')
		current_date = datetime.datetime.now()
		exam_list = []
		for data in exam_data:
			exam_obj = {
				"name": data[1],
				"created_date": current_date,
				"last_updated_date": current_date,
				"created_by":"",
				"exam_id":data[0]
			}
			exam_list.append(exam_obj)
		self.import_data_in_mongo(exam_list, EXAM)
