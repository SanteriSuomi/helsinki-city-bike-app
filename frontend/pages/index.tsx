import { useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
	async function test() {
		const response = await fetch(
			"http://localhost:3000/stations/search/100"
		);
		const result = await response.json();
		console.log(result);
	}
	useEffect(() => {
		test();
	}, []);
	return <>test</>;
}
