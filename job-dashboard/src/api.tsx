const API_URL = import.meta.env.VITE_API_URL;

export async function getJobs() {
	const response = await fetch(`${API_URL}/jobs`);
	return response.json();
}

export async function searchJobs(query: string) {
	const response = await fetch(`${API_URL}/search?q=${query}`);

	return response.json();
}
