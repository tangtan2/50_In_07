import psycopg2
from psycopg2.extensions import connection
from config import get_config


def create_connection() -> connection:
    print('[INFO] PSQL database connection opened!')
    config = get_config()
    return psycopg2.connect(
        host=config["host"],
        database=config["database"],
        user=config["user"])


def execute_sql_with_return(open_connection: connection, sql_text: str) -> []:
    print('[INFO] Executing SQL script...')
    try:
        with open_connection.cursor() as new_cursor:
            new_cursor.execute(sql_text)
            return new_cursor.fetchall()
    except (Exception, psycopg2.DatabaseError) as error:
        print('[ERROR] Error while executing SQL:', error)
        raise error


def execute_sql(open_connection: connection, sql_text: str) -> None:
    print('[INFO] Executing SQL script...')
    try:
        with open_connection.cursor() as new_cursor:
            new_cursor.execute(sql_text)
    except (Exception, psycopg2.DatabaseError) as error:
        print('[ERROR] Error while executing SQL:', error)
        raise error


def execute_bulk_insert_sql(open_connection: connection, sql_text_list: [str]) -> None:
    print('[INFO] Executing SQL scripts...')
    try:
        with open_connection.cursor() as new_cursor:
            for sql_text in sql_text_list:
                new_cursor.execute(sql_text)
    except (Exception, psycopg2.DatabaseError) as error:
        print('[ERROR] Error while executing SQL:', error)
        raise error


def close_and_commit_connection(open_connection: connection) -> None:
    open_connection.commit()
    open_connection.close()
    print('[INFO] Database connection closed!')
