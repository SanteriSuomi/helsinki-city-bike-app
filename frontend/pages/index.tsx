import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import Journeys from "../components/journeys";

export default function Home() {
	const [path, setPath] = useState("");
	useEffect(() => {
		setPath(window.location.pathname);
	}, []);

	const getContentTitle = () => {
		return path.charAt(1).toUpperCase() + path.slice(2);
	};

	const getContent = () => {
		console.log(path);
		if (path === "/journeys") {
			return (
				<>
					<div className={styles.contentTitle}>
						{getContentTitle()}
					</div>
					<Journeys></Journeys>
				</>
			);
		}
	};

	return (
		<>
			<div className={styles.header}>
				<div>Helsinki City Bike App</div>
			</div>
			<div className={styles.contentWrapper}>{getContent()}</div>
		</>
	);
}
