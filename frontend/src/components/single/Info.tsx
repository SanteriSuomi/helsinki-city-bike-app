import { FunctionComponent } from "react";
import { StationDetailedInfo } from "../../types/data";
import { TopStation } from "../../types/database";
import "./info.css";

interface IInfoProps {
	startTitle: string;
	endTitle: string;
	info?: StationDetailedInfo;
}

const Info: FunctionComponent<IInfoProps> = ({
	startTitle,
	endTitle,
	info,
}) => {
	return (
		<div>
			{info ? (
				<div>
					<div className="station-info-title">{startTitle}</div>
					<div>{`Total count: ${info.totalCount}`}</div>
					<div>{`Average distance: ${info.averageDistance.toFixed(
						0
					)}`}</div>
					<div>
						<div className="station-info-title">{endTitle}</div>
						<div>
							{`${info.topStations.map((station: TopStation) => {
								return ` ${station.id}`;
							})}`}
						</div>
					</div>
				</div>
			) : (
				""
			)}
		</div>
	);
};

export default Info;
