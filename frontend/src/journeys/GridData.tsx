import { FunctionComponent } from "react";
import "./journeys.css";

interface IGridDataProps {
	text: string | number;
	gridRow: number;
	gridColumn: number;
	setSort?: (obj: any) => void;
}

const GridData: FunctionComponent<IGridDataProps> = ({
	text,
	gridColumn,
	gridRow,
	setSort,
}) => {
	return (
		<div
			className="journeys-data"
			style={{ gridColumn: gridColumn, gridRow: gridRow }}
			onClick={() => {
				if (setSort) {
					console.log("sort");
				}
			}}
		>
			{text}
		</div>
	);
};

export default GridData;
