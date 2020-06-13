import psycopg2
import pyspark
import findspark
import os


# connect to an existing database
def connect(db_name: str):
    print(f'[INFO] opening connection to {db_name}...')
    db = psycopg2.connect(f'dbname={db_name} user=postgres')
    cursor = db.cursor()
    print('done')
    return db, cursor


# disconnect from active database
def disconnect(db, cursor):
    print(f'[INFO] committing changes and closing connection from {db.get_dsn_parameters()["dbname"]}...')
    db.commit()
    cursor.close()
    db.close()
    print('done')


# open spark session
def start_spark(name: str) -> pyspark.sql.SparkSession:
    print('[INFO] setting up environment and opening new spark session...')
    # set up environment
    os.environ["JAVA_HOME"] = "/Library/Java/JavaVirtualMachines/jdk1.8.0_231.jdk/Contents/Home/"
    os.environ["JRE_HOME"] = "/Library/Java/JavaVirtualMachines/jdk1.8.0_231.jdk/Contents/Home/"
    findspark.init("/usr/local/Cellar/apache-spark/2.4.5/libexec/")
    print('environment configured')
    # start spark
    spark = pyspark.sql\
        .SparkSession\
        .builder\
        .appName(name)\
        .config('spark.jars', '/Users/tanyatang/Documents/Code/resources/postgresql/postgresql-42.2.12.jar')\
        .getOrCreate()
    print('done')
    return spark


# close spark session
def close_spark(spark: pyspark.sql.SparkSession):
    print('[INFO] closing spark session...')
    spark.stop()
    print('done')
