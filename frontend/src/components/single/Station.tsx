import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { StationDetailedInfo } from "../../types/data";
import { Station as TStation } from "../../types/database";
import GoogleMap from "google-map-react";
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
				`${process.env.REACT_APP_API_URL}/journeys/stations/${start}?id=${station.id}&top=5`
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
		<div className="station-content">
			<div className="station-name">
				Station{" "}
				<span className="station-name-title-info">
					{station.name}, {station.address}
				</span>
			</div>
			<Info
				startTitle="Journeys starting from station"
				endTitle="Top 5 most popular return stations for journeys
				starting from station"
				info={departureData}
			></Info>
			<Info
				startTitle="Journeys ending to station"
				endTitle="Top 5 most popular starting stations for journeys
				ending to station"
				info={returnData}
			></Info>

			<div style={{ height: "550px", width: "550px" }}>
				<GoogleMap
					bootstrapURLKeys={{
						key: process.env.REACT_APP_API_MAP_KEY as string,
					}}
					defaultCenter={{ lat: station.y, lng: station.x }}
					defaultZoom={19}
				>
					<div
						className="station-map-marker"
						{...{ lat: station.y, lng: station.x }}
					>
						{station.name}
					</div>
				</GoogleMap>
			</div>
		</div>
	);
}
