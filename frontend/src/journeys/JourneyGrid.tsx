import { Fragment, FunctionComponent } from "react";
import { Journey } from "../../types/database";
import GridData from "./GridData";
import "./journeys.css";

interface IGridProps {
	journeys?: Journey[];
}

const JourneysGrid: FunctionComponent<IGridProps> = ({ journeys }) => {
	return (
		<div className="journeys-grid">
			<GridData
				text={"Departure Date"}
				gridColumn={1}
				gridRow={1}
			></GridData>
			<GridData
				text={"Return Date"}
				gridColumn={2}
				gridRow={1}
			></GridData>
			<GridData
				text={"Dep. Station ID"}
				gridColumn={3}
				gridRow={1}
			></GridData>
			<GridData
				text={"Dep. Station Name"}
				gridColumn={4}
				gridRow={1}
			></GridData>
			<GridData
				text={"Ret. Station ID"}
				gridColumn={5}
				gridRow={1}
			></GridData>
			<GridData
				text={"Dep. Station Name"}
				gridColumn={6}
				gridRow={1}
			></GridData>
			<GridData text={"Distance"} gridColumn={7} gridRow={1}></GridData>
			<GridData text={"Duration"} gridColumn={8} gridRow={1}></GridData>
			{journeys?.map((journey: Journey, index: number) => {
				const gridRow = index + 2;
				return (
					<Fragment
						key={`${journey.return_date}-${journey.departure_date}`}
					>
						<GridData
							key={`${journey.departure_date}-${journey.return_date}`}
							text={journey.departure_date}
							gridColumn={1}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={`${journey.covered_distance}-${journey.return_date}`}
							text={journey.return_date}
							gridColumn={2}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={`${journey.departure_station_name}-${journey.covered_distance}`}
							text={journey.departure_station_name}
							gridColumn={3}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={`${journey.covered_distance}-${journey.covered_distance}`}
							text={journey.departure_station_id}
							gridColumn={4}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={`${journey.return_station_id}-${journey.return_station_name}`}
							text={journey.return_station_name}
							gridColumn={5}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={`${journey.return_station_id}-${journey.duration}`}
							text={journey.return_station_id}
							gridColumn={6}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={`${journey.departure_date}-${journey.covered_distance}`}
							text={journey.covered_distance}
							gridColumn={7}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={`${journey.covered_distance}-${journey.duration}`}
							text={journey.duration}
							gridColumn={8}
							gridRow={gridRow}
						></GridData>
					</Fragment>
				);
			})}
		</div>
	);
};

export default JourneysGrid;
