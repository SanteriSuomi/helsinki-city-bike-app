import { Fragment, useEffect, useState } from "react";
import { Journey } from "../../types/database";
import JourneyData from "./JourneyData";
import "../styles/journeys.css";

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
			<div className="journeys-list">
				<JourneyData
					text={"Departure Date"}
					gridColumn={1}
					gridRow={1}
				></JourneyData>
				<JourneyData
					text={"Return Date"}
					gridColumn={2}
					gridRow={1}
				></JourneyData>
				<JourneyData
					text={"Dep. Station"}
					gridColumn={3}
					gridRow={1}
				></JourneyData>
				<JourneyData
					text={"Ret. Station"}
					gridColumn={4}
					gridRow={1}
				></JourneyData>
				<JourneyData
					text={"Distance"}
					gridColumn={5}
					gridRow={1}
				></JourneyData>
				<JourneyData
					text={"Duration"}
					gridColumn={6}
					gridRow={1}
				></JourneyData>
				{data?.items.map((journey: Journey, index: number) => {
					const ind = index + 2;
					return (
						<Fragment
							key={`${journey.return_date}-${journey.departure_date}`}
						>
							<JourneyData
								key={`${journey.departure_date}-${journey.return_date}`}
								text={journey.departure_date}
								gridColumn={1}
								gridRow={ind}
							></JourneyData>
							<JourneyData
								key={`${journey.covered_distance}-${journey.return_date}`}
								text={journey.return_date}
								gridColumn={2}
								gridRow={ind}
							></JourneyData>
							<JourneyData
								key={`${journey.covered_distance}-${journey.covered_distance}`}
								text={journey.departure_station_id}
								gridColumn={3}
								gridRow={ind}
							></JourneyData>
							<JourneyData
								key={`${journey.return_station_id}-${journey.duration}`}
								text={journey.return_station_id}
								gridColumn={4}
								gridRow={ind}
							></JourneyData>
							<JourneyData
								key={`${journey.departure_date}-${journey.covered_distance}`}
								text={journey.covered_distance}
								gridColumn={5}
								gridRow={ind}
							></JourneyData>
							<JourneyData
								key={`${journey.covered_distance}-${journey.duration}`}
								text={journey.duration}
								gridColumn={6}
								gridRow={ind}
							></JourneyData>
						</Fragment>
					);
				})}
			</div>
		</div>
	);
}
