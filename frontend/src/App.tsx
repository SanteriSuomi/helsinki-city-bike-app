import { Outlet } from "react-router-dom";
import ContentButton from "./components/ContentButton";
import "./app.css";

export default function App() {
	return (
		<div className="app-content">
			<div className="app-header">
				<div>Helsinki City Bike App</div>
			</div>
			<div className="app-buttons">
				<ContentButton text="Journeys" to="/journeys"></ContentButton>
				<ContentButton text="Stations" to="/stations"></ContentButton>
			</div>
			<Outlet></Outlet>
		</div>
	);
}
