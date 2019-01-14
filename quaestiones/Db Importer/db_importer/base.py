
class DBImporter(object):

    def __init__(self, mysql_con, mongo_con):
        self.mysql_connection = mysql_con
        self.mongo_connection = mongo_con

    def get_sql(self, query):
        '''
        :param query:
        :return:
        use self.mysql_connection and execute this query and return data
        '''
        mysql_conn = self.mysql_connection
        cursor = mysql_conn.cursor(buffered=True)
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        mysql_conn.close()
        return result

    def import_data_in_mongo(self, data_list, collection):
        '''
        :param data_list:
        :param collection:
        :return:
         use self.mongo_connection and use bulk import to import data in collection
        '''
        mongo_conn = self.mongo_connection
        mongo_collection = mongo_conn[collection]
        mongo_collection.insert(data_list)
        return True


    def import_data_in_mongo_single_obj(self, data, collection):
        '''
        :param data_list:
        :param collection:
        :return:
          use self.mongo_connection and use simple import to import data in collection
        :To print record in collection
         cursor = mongo_collection.find()
         for record in cursor:
             print(record)
        '''
        mongo_conn = self.mongo_connection
        mongo_collection = mongo_conn[collection]
        result = mongo_collection.insert_one(data)
        return result

    def get_mongo_data(self,query, collection):
        '''
        :param query:
        :param collection:
        :return:
        '''
        mongo_conn = self.mongo_connection
        mongo_collection = mongo_conn[collection]
        result = mongo_collection.find(query)
        return result
