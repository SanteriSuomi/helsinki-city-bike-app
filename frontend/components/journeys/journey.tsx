import { FunctionComponent } from "react";
import { Journey } from "../../types/database";
import styles from "../../styles/Journey.module.css";

interface IJourneyComponentProps {
	journey: Journey;
}

const JourneyComponent: FunctionComponent<IJourneyComponentProps> = ({
	journey,
}) => {
	return (
		<div className={styles.info}>
			<div className={styles.infoText}>
				{journey.departure_station_id}
			</div>
			<div className={styles.infoText}>{journey.return_station_id}</div>
			<div className={styles.infoText}>{journey.covered_distance}</div>
			<div className={styles.infoText}>{journey.duration}</div>
		</div>
	);
};

export default JourneyComponent;
