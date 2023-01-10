import { useEffect, useState } from "react";
import { Journey } from "../../types/database";
import JourneyGrid from "./JourneyGrid";
import "./journeys.css";

export default function Journeys() {
	const [data, setData] = useState<{
		totalCount: number;
		items: Journey[];
	}>();

	const [sort, setSort] = useState<{ column: string; order: string }>({
		column: "departure_date",
		order: "asc",
	});

	useEffect(() => {
		const fetchJourneys = async () => {
			console.log(
				`${process.env.REACT_APP_API_URL}/journeys?column=${sort.column}&order=${sort.order}&offset=0&limit=20`
			);
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/journeys?column=${sort.column}&order=${sort.order}&offset=0&limit=20`
			);
			if (response.ok) {
				const result = await response.json();
				setData(result.content);
			}
		};
		fetchJourneys();
	}, [sort]);

	return (
		<div className="journeys-content">
			<div>
				<div>Sort Column</div>
				<input type="text" id="username" name="username"></input>
			</div>

			<JourneyGrid journeys={data?.items} setSort={setSort}></JourneyGrid>
			<div>
				Page {1} out of {data && (data.totalCount / 20).toFixed(0)} (
				{data?.totalCount?.toFixed(0)} journeys in total)
			</div>
		</div>
	);
}
