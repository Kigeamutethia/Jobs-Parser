import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, Bookmark, MapPin, Tag } from "lucide-react";
import { getJobs, searchJobs } from "./api";

interface Job {
	title: string;
	company: string;
	location: string;
	skills: string;
	apply_link: string;
}

export default function App() {
	const [jobs, setJobs] = useState<Job[]>([]);
	const [query, setQuery] = useState("");
	const [saved, setSaved] = useState<Job[]>([]);
	const [viewSaved, setViewSaved] = useState(false);
	const [loading, setLoading] = useState(false);

	const loadJobs = async () => {
		setLoading(true);

		const data = await getJobs();

		setJobs(data);
		setLoading(false);
	};

	useEffect(() => {
		loadJobs();

		const stored = localStorage.getItem("savedJobs");

		if (stored) {
			setSaved(JSON.parse(stored));
		}
	}, []);

	const handleSearch = async () => {
		setLoading(true);

		const data = query ? await searchJobs(query) : await getJobs();

		setJobs(data);
		setLoading(false);
	};

	const toggleSave = (job: Job) => {
		const exists = saved.find((j) => j.apply_link === job.apply_link);

		const updated = exists
			? saved.filter((j) => j.apply_link !== job.apply_link)
			: [...saved, job];

		setSaved(updated);

		localStorage.setItem("savedJobs", JSON.stringify(updated));
	};

	const displayJobs = viewSaved ? saved : jobs;

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
			{/* SIDEBAR */}
			<div className="w-72 bg-white/70 backdrop-blur-xl border-r p-5 sticky top-0 h-screen">
				<h1 className="text-2xl font-bold mb-6">💼 JobFlow</h1>

				{/* SEARCH */}
				<div className="relative mb-4">
					<Search className="absolute left-3 top-3 text-gray-400 w-4" />

					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search jobs..."
						className="w-full pl-9 pr-3 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
					/>
				</div>

				<button
					onClick={handleSearch}
					className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
					Search
				</button>

				{/* NAV */}
				<div className="mt-6 space-y-2">
					<button
						onClick={() => setViewSaved(false)}
						className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
						📊 All Jobs
					</button>

					<button
						onClick={() => setViewSaved(true)}
						className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
						<Bookmark size={16} />
						Saved Jobs
					</button>
				</div>
			</div>

			{/* MAIN */}
			<div className="flex-1 p-8">
				{/* HEADER */}
				<div className="mb-6">
					<h2 className="text-3xl font-bold tracking-tight">Discover Jobs</h2>

					<p className="text-gray-500">
						Smart curated opportunities for engineers & analysts
					</p>
				</div>

				{/* GRID */}
				{loading ? (
					<p className="text-gray-500">Loading jobs...</p>
				) : (
					<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
						{displayJobs.map((job: Job, i: number) => (
							<motion.div
								key={i}
								initial={{
									opacity: 0,
									y: 10,
								}}
								animate={{
									opacity: 1,
									y: 0,
								}}
								whileHover={{
									scale: 1.02,
								}}
								transition={{
									duration: 0.2,
								}}
								className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-xl transition relative overflow-hidden">
								{/* BADGE */}
								<div className="absolute top-3 right-3 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
									Remote
								</div>

								{/* TITLE */}
								<h3 className="font-semibold text-lg leading-tight">
									{job.title}
								</h3>

								{/* COMPANY */}
								<div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
									<MapPin size={14} />
									{job.company} • {job.location}
								</div>

								{/* SKILLS */}
								<div className="flex flex-wrap gap-2 mt-3">
									{job.skills
										?.split(",")
										.slice(0, 3)
										.map((s: string, idx: number) => (
											<span
												key={idx}
												className="text-xs bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1">
												<Tag size={10} />
												{s.trim()}
											</span>
										))}
								</div>

								{/* FOOTER */}
								<div className="flex justify-between items-center mt-5">
									<button
										onClick={() => toggleSave(job)}
										className="text-sm text-gray-500 hover:text-black transition">
										⭐ Save
									</button>

									<a
										href={job.apply_link}
										target="_blank"
										rel="noreferrer"
										className="text-blue-600 font-medium hover:underline">
										Apply →
									</a>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
