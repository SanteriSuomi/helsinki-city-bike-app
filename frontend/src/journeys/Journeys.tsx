import { useEffect, useState } from "react";
import { Journey } from "../types/database";
import Grid from "../components/grid/Grid";
import "./journeys.css";
import { JOURNEYS_GRID_HEADERS } from "../constants";

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
		console.log(sort);
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
				<div>Sort By:</div>
				<select
					onChange={(event: any) => {
						setSort({
							column: event.target.value,
							order: sort.order,
						});
					}}
				>
					{JOURNEYS_GRID_HEADERS.map((header) => {
						return (
							<option key={header.dbKey} value={header.dbKey}>
								{header.text}
							</option>
						);
					})}
				</select>
			</div>

			<Grid
				headers={JOURNEYS_GRID_HEADERS}
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
