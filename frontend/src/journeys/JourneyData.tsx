import { FunctionComponent } from "react";
import "../styles/journey.css";

interface IJourneyDataProps {
	text: string | number;
	gridRow: number;
	gridColumn: number;
}

const JourneyData: FunctionComponent<IJourneyDataProps> = ({
	text,
	gridColumn,
	gridRow,
}) => {
	return (
		<div
			className="journey-data"
			style={{ gridColumn: gridColumn, gridRow: gridRow }}
		>
			{text}
		</div>
	);
};

export default JourneyData;
