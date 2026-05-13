from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from app.db import get_con, init_db
from app.pipeline.ingest import run_ingestion

app = FastAPI(title="Jobs Parser API", version="1.0")

# =========================
# CORS (DEV + DEPLOYMENT)
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later for SaaS
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DB INIT
# =========================
con = get_con()
init_db()


# =========================
# HEALTH CHECK
# =========================
@app.get("/")
def home():
    return {
        "status": "API running 🚀",
        "docs": "/docs",
        "endpoints": {
            "jobs": "/jobs",
            "search": "/jobs/search?q=python",
            "ingest": "/ingest"
        }
    }


# =========================
# GET ALL JOBS
# =========================
@app.get("/jobs")
def get_jobs():
    df = con.execute("""
        SELECT * FROM jobs
        ORDER BY days_old ASC
    """).fetchdf()

    return df.to_dict(orient="records")


# =========================
# SEARCH JOBS
# =========================
@app.get("/jobs/search")
def search_jobs(q: str):
    df = con.execute("""
        SELECT * FROM jobs
        WHERE lower(title) LIKE lower('%' || ? || '%')
           OR lower(skills) LIKE lower('%' || ? || '%')
        ORDER BY days_old ASC
    """, (q, q)).fetchdf()

    return df.to_dict(orient="records")


# =========================
# INGESTION ENDPOINT
# (USED BY GITHUB CRON)
# =========================
@app.post("/ingest")
def ingest(background_tasks: BackgroundTasks):
    background_tasks.add_task(run_ingestion)

    return {
        "status": "ingestion started 🚀",
        "message": "Scraper is running in background"
    }


# =========================
# DB HEALTH CHECK
# =========================
@app.get("/health/db")
def db_health():
    count = con.execute("SELECT COUNT(*) FROM jobs").fetchone()[0]

    return {
        "status": "ok",
        "jobs_in_db": count
    }