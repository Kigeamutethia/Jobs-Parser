from app.pipeline.ingest import run_ingestion
from app.db import init_db

if __name__ == "__main__":
    print("🚀 Starting ingestion...")
    init_db()
    run_ingestion()
    print("🎯 Done")