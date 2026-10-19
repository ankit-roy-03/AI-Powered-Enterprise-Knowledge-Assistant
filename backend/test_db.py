
from database import get_db_connection

try:
    connection = get_db_connection()
    cursor = connection.cursor()

    cursor.execute("SHOW TABLES")
    tables = cursor.fetchall()

    print("MySQL connected successfully!")
    print("Tables:", tables)

    cursor.close()
    connection.close()

except Exception as error:
    print("Error:", error)
