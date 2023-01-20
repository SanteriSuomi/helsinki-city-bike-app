import { FunctionComponent } from "react";
import { StationDetailedInfo } from "../../types/data";
import { TopStation } from "../../types/database";
import "./info.css";

interface IInfoProps {
	info?: StationDetailedInfo;
}

const Info: FunctionComponent<IInfoProps> = ({ info }) => {
	return (
		<div>
			{info ? (
				<div>
					<div>Journeys starting from station</div>
					<div>{`Total count ${info.totalCount}`}</div>
					<div>{`Average distance ${info.averageDistance}`}</div>
					<div>
						<div>
							Top 5 most popular return stations for journeys
							starting from station
						</div>
						{info.topStations.map((station: TopStation) => {
							return (
								<div key={station.id}>
									<div>{station.journey_count}</div>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default Info;
