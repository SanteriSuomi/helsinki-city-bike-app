import { useEffect, useState } from "react";
import { Journey } from "../../types/database";
import JourneyGrid from "./JourneyGrid";
import "./journeys.css";

export default function Journeys() {
	const [data, setData] = useState<{
		totalCount: number;
		items: Journey[];
	}>();

	useEffect(() => {
		const fetchJourneys = async () => {
			const response = await fetch(
				"http://localhost:3000/journeys?column=departure_station_id&order=asc&offset=0&limit=20"
			);
			if (response.ok) {
				const result = await response.json();
				setData(result.content);
			}
		};
		fetchJourneys();
	}, []);

	return (
		<div className="journeys-content">
			<JourneyGrid journeys={data?.items}></JourneyGrid>
		</div>
	);
}
