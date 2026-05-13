const BASE_URL = "http://127.0.0.1:8000";

export const getJobs = async () => {
	const res = await fetch(`${BASE_URL}/jobs`);
	return res.json();
};

export const searchJobs = async (q) => {
	const res = await fetch(`${BASE_URL}/jobs/search?q=${q}`);
	return res.json();
};
