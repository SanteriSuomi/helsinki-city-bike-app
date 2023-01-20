import { FunctionComponent, useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { AbortableFetch } from "../../types/data";
import { Station as TStation } from "../../types/database";
import { abortableFetch } from "../../utils/fetch";
import "./station.css";

interface ISelectorProps {}

let fetchObject: AbortableFetch | null;

const Station: FunctionComponent<ISelectorProps> = () => {
	const station = useLoaderData() as TStation;

	const [journeysFrom, setJourneysFrom] = useState([]);
	const [journeysTo, setJourneysTo] = useState([]);

	const fetchData = async (
		start: string,
		setData: (resultContent: any) => void
	) => {
		if (fetchObject) {
			fetchObject.abort();
			fetchObject = null;
		}
		let response;
		try {
			fetchObject = abortableFetch(
				`${process.env.REACT_APP_API_URL}/stations/journeys/${start}?id=${station.id}&avg=covered_distance&all=.&column=departure_station_id&order=asc&offset=5&limit=5`
			);
			response = await fetchObject.request;
			fetchObject = null;
		} catch (error) {
			console.log(error);
		}

		if (response?.ok) {
			const result = await response.json();
			console.log(start, result.content);
			setData(result.content);
		}
	};

	useEffect(() => {
		fetchData("start", (resultContent: any) => {
			setJourneysFrom(resultContent);
		});
		fetchData("end", (resultContent: any) => {
			setJourneysTo(resultContent);
		});
	}, []);

	return (
		<div>
			<div>{station.name}</div>
			<div>{station.address}</div>
		</div>
	);
};

export default Station;
