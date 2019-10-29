import mysql.connector


# Connect to MySQL
def connect_db():
    mydb = mysql.connector.connect(host='localhost',
                                   user='root',
                                   passwd='56819230',
                                   database='50_In_07')
    mycursor = mydb.cursor()
    return mydb, mycursor


# Disconnect from MySQL
def disconnect_db(mydb, mycursor):
    mydb.commit()
    mycursor.close()
    mydb.close()
