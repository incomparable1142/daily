from base import DBImporter
from pymongo import MongoClient
import mysql.connector
import datetime
from config.config import MONGO_CONNECTION, BANNER, MYSQL_CONNECTION

class BannerImporter(DBImporter):

    def __init__(self):
        client = MongoClient()
        mongo_conn = MONGO_CONNECTION
        mysql_conn = MYSQL_CONNECTION
        super(BannerImporter, self).__init__(mysql_conn, mongo_conn)
        self.import_data()

    def import_data(self):
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
