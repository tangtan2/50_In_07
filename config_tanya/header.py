import mysql.connector


# Connect to MySQL
def connect_db():
    mydb = mysql.connector.connect(host='Tanyas-MacBook-Pro.local',
                                   user='root',
                                   password='56819230',
                                   database='50_In_07',
                                   auth_plugin='mysql_native_password')
    mycursor = mydb.cursor(buffered=True)
    return mydb, mycursor


# Disconnect from MySQL
def disconnect_db(mydb, mycursor):
    mydb.commit()
    mycursor.close()
    mydb.close()
