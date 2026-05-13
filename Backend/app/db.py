import duckdb
from app.config import DB_PATH

con = duckdb.connect(DB_PATH)

def get_con():
    return con


def init_db():
    con.execute("""
    CREATE TABLE IF NOT EXISTS jobs (
        title VARCHAR,
        company VARCHAR,
        salary_min VARCHAR,
        salary_max VARCHAR,
        location VARCHAR,
        date_posted VARCHAR,
        days_old VARCHAR,
        skills VARCHAR,
        apply_link VARCHAR
    )
    """)