import { useEffect, useState } from "react";
import { Journey } from "../../types/database";
import JourneyComponent from "./journey";
import styles from "../styles/Journeys.module.css";

export default function Journeys() {
	const [data, setData] = useState<{
		totalCount: number;
		items: Journey[];
	}>();

	useEffect(() => {
		const fetchJourneys = async () => {
			const response = await fetch(
				"http://localhost:3000/journeys?column=departure_station_id&order=asc&offset=0&limit=15"
			);
			if (response.ok) {
				const result = await response.json();
				setData(result.content);
			}
		};
		fetchJourneys();
	}, []);

	return (
		<>
			{data?.items.map((j: Journey) => {
				return (
					<JourneyComponent
						key={
							j.departure_station_id +
							j.covered_distance +
							j.duration
						}
						journey={j}
					></JourneyComponent>
				);
			})}
		</>
	);
}
