import { FunctionComponent } from "react";
import "./journeys.css";

interface IGridDataProps {
	text: string | number;
	gridRow: number;
	gridColumn: number;
}

const GridData: FunctionComponent<IGridDataProps> = ({
	text,
	gridColumn,
	gridRow,
}) => {
	return (
		<div
			className="journeys-data"
			style={{ gridColumn: gridColumn, gridRow: gridRow }}
		>
			{text}
		</div>
	);
};

export default GridData;
