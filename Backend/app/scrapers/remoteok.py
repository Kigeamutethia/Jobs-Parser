import requests
from datetime import datetime

URL = "https://remoteok.com/api"

keywords = ["data", "analytics", "engineer", "scientist", "python", "sql"]


def fetch_remoteok_jobs():
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(URL, headers=headers)
    response.raise_for_status()

    data = response.json()

    jobs = []

    for job in data[1:]:
        title = job.get("position", "")
        title_lower = title.lower()

        if not any(k in title_lower for k in keywords):
            continue

        date_posted = job.get("date", None)

        try:
            posted_date = datetime.fromisoformat(date_posted.replace("Z", "+00:00"))
            days_old = (datetime.now(posted_date.tzinfo) - posted_date).days
        except:
            days_old = 0

        jobs.append({
            "title": title,
            "company": job.get("company", "N/A"),
            "location": job.get("location", "Remote"),
            "salary_min": job.get("salary_min", 0),
            "salary_max": job.get("salary_max", 0),
            "skills": ", ".join(job.get("tags", [])),
            "apply_link": job.get("url", ""),
            "date_posted": date_posted,
            "days_old": days_old
        })

    return jobs


if __name__ == "__main__":
    jobs = fetch_remoteok_jobs()
    print(jobs) 