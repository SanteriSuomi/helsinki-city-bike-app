import { useEffect, useState } from "react";
import { Journey } from "../../types/database";
import Grid from "../components/grid/Grid";
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

			{/* <JourneyGrid journeys={data?.items} setSort={setSort}></JourneyGrid> */}
			<Grid
				headers={[
					{
						text: "Departure Date",
						dbKey: "departure_date",
						isDate: true,
					},
					{ text: "Return Date", dbKey: "return_date", isDate: true },
					{
						text: "Dep. Station Name",
						dbKey: "departure_station_name",
					},
					{ text: "Dep. Station ID", dbKey: "departure_station_id" },
					{ text: "Ret. Station Name", dbKey: "return_station_name" },
					{ text: "Ret. Station ID", dbKey: "return_station_id" },
					{ text: "Distance", dbKey: "covered_distance" },
					{ text: "Duration", dbKey: "duration" },
				]}
				data={data?.items}
				setSort={setSort}
			></Grid>

			<div>
				Page {1} out of {data && (data.totalCount / 20).toFixed(0)} (
				{data?.totalCount?.toFixed(0)} journeys in total)
			</div>
		</div>
	);
}
