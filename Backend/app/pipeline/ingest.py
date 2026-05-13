from app.db import get_con
from app.scrapers.remoteok import fetch_remoteok_jobs
from datetime import datetime

def run_ingestion():
    print("🚀 Starting ingestion pipeline...")

    con = get_con()

    # 1. Fetch jobs from scraper
    jobs = fetch_remoteok_jobs()

    inserted = 0

    for job in jobs:
        try:
            con.execute("""
                INSERT INTO jobs (
                    title,
                    company,
                    location,
                    salary_min,
                    salary_max,
                    skills,
                    apply_link,
                    date_posted,
                    days_old
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                job["title"],
                job["company"],
                job["location"],
                job["salary_min"],
                job["salary_max"],
                job["skills"],
                job["apply_link"],
                job["date_posted"],
                job["days_old"]
            ))

            inserted += 1

        except Exception as e:
            print(f"❌ Failed inserting job: {e}")

    print(f"✅ Ingestion complete. Inserted {inserted} jobs")


if __name__ == "__main__":
    run_ingestion()