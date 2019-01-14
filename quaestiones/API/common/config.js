var config =
    {
        'db': {
            'connectionString': process.env.DATABASE_URL || 'mongodb://localhost:27017',
            'name': 'questionaire_db'
        },
        'secret' : 'questionaires',

        'statusCodes': {
            'success': 1000,
            'failure': 1001,
            'fieldRequired': 1002,
            'invalidRequest': 1003,
            'unavailable': 1004,
            'inprogress': 1005,



            'db': {
                'ConnectionError': 3001,
                'QueryError': 3002
            }
        }
    };

module.exports = config;
