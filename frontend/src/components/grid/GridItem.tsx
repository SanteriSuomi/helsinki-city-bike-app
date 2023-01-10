import { FunctionComponent } from "react";
import "./griditem.css";

interface IGridDataProps {
	text: string | number;
	gridRow: number;
	gridColumn: number;
	setSort?: (obj: any) => void;
}

const GridItem: FunctionComponent<IGridDataProps> = ({
	text,
	gridColumn,
	gridRow,
	setSort,
}) => {
	return (
		<div
			className="grid-item"
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

export default GridItem;
