import { FunctionComponent } from "react";
import { Station as TStation } from "../../types/database";
import "./station.css";

interface ISelectorProps {
	station: TStation;
}
//http://localhost:4000/stations/journeys/start?id=100&avg=covered_distance&all=.&column=departure_station_id&order=asc&offset=5&limit=5
const Station: FunctionComponent<ISelectorProps> = ({ station }) => {
	return (
		<div>
			<div>{station.name}</div>
			<div>{station.address}</div>
		</div>
	);
};

export default Station;
