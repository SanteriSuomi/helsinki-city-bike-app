import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { StationDetailedInfo } from "../../types/data";
import { Station as TStation } from "../../types/database";
import Info from "./Info";
import "./station.css";

export default function Station() {
	const station = useLoaderData() as TStation;

	const [departureData, setDepartureData] = useState<StationDetailedInfo>();
	const [returnData, setReturnData] = useState<StationDetailedInfo>();

	const fetchData = async (
		start: string,
		setData: (resultContent: any) => void
	) => {
		let journeysResponse;
		let stationsResponse;
		try {
			journeysResponse = await fetch(
				`${process.env.REACT_APP_API_URL}/stations/journeys/${start}?id=${station.id}&avg=covered_distance`
			);
			stationsResponse = await fetch(
				`${process.env.REACT_APP_API_URL}/journeys/stations/${start}?id=100&top=5`
			);
		} catch (error) {
			console.log(error);
		}

		if (journeysResponse?.ok && stationsResponse?.ok) {
			const journeysResult = await journeysResponse.json();
			const stationsResult = await stationsResponse.json();
			setData({
				...journeysResult.content,
				...stationsResult.content,
			});
		}
	};

	useEffect(() => {
		fetchData("departure", (resultContent: any) => {
			setDepartureData(resultContent);
		});
		fetchData("return", (resultContent: any) => {
			setReturnData(resultContent);
		});
	}, []);

	return (
		<div>
			<div>Name {station.name}</div>
			<div>Address {station.address}</div>
			<Info info={departureData}></Info>
			<Info info={returnData}></Info>
		</div>
	);
}
