import { Fragment, FunctionComponent } from "react";
import { Journey } from "../../types/database";
import GridData from "./GridData";
import "./journeys.css";

interface IGridProps {
	journeys?: Journey[];
	setSort: (obj: any) => void;
}

const JourneyGrid: FunctionComponent<IGridProps> = ({ journeys, setSort }) => {
	return (
		<div className="journeys-grid">
			<GridData
				text={"Departure Date"}
				gridColumn={1}
				gridRow={1}
				setSort={setSort}
			></GridData>
			<GridData
				text={"Return Date"}
				gridColumn={2}
				gridRow={1}
				setSort={setSort}
			></GridData>
			<GridData
				text={"Dep. Station Name"}
				gridColumn={3}
				gridRow={1}
				setSort={setSort}
			></GridData>
			<GridData
				text={"Dep. Station ID"}
				gridColumn={4}
				gridRow={1}
				setSort={setSort}
			></GridData>
			<GridData
				text={"Dep. Station Name"}
				gridColumn={5}
				gridRow={1}
				setSort={setSort}
			></GridData>
			<GridData
				text={"Ret. Station ID"}
				gridColumn={6}
				gridRow={1}
				setSort={setSort}
			></GridData>
			<GridData text={"Distance"} gridColumn={7} gridRow={1}></GridData>
			<GridData text={"Duration"} gridColumn={8} gridRow={1}></GridData>
			{journeys?.map((journey: Journey, index: number) => {
				const gridRow = index + 2;
				return (
					<Fragment key={gridRow + 1}>
						<GridData
							key={gridRow}
							text={new Date(
								journey.departure_date
							).toLocaleDateString()}
							gridColumn={1}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={gridRow + 2}
							text={new Date(
								journey.return_date
							).toLocaleDateString()}
							gridColumn={2}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={gridRow + 3}
							text={journey.departure_station_name}
							gridColumn={3}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={gridRow + 4}
							text={journey.departure_station_id}
							gridColumn={4}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={gridRow + 5}
							text={journey.return_station_name}
							gridColumn={5}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={gridRow + 6}
							text={journey.return_station_id}
							gridColumn={6}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={gridRow + 7}
							text={journey.covered_distance}
							gridColumn={7}
							gridRow={gridRow}
						></GridData>
						<GridData
							key={gridRow + 8}
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

export default JourneyGrid;
