import mysql.connector


# Connect to MySQL
def connect_db(database):
    print('Connecting to SQL database...')
    mydb = mysql.connector.connect(user='root',
                                   database=database,
                                   auth_plugin='mysql_native_password')
    mycursor = mydb.cursor(buffered=True)
    print('Connected to SQL database')
    return mydb, mycursor


# Disconnect from MySQL
def disconnect_db(mydb, mycursor):
    print('Committing database changes...')
    mydb.commit()
    print('Disconnecting from SQL database...')
    mycursor.close()
    mydb.close()
    print('Disconnected from SQL database')
