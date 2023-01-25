import { Outlet } from "react-router-dom";
import ContentButton from "./components/ContentButton.tsx";
import { useCallback, useState } from "react";
import "./app.css";

export default function App() {
	const [openUploadMenu, setOpenUploadMenu] = useState(false);

	const toggleUploadMenu = useCallback(() => {
		setOpenUploadMenu(!openUploadMenu);
	}, [openUploadMenu]);

	const disableUploadMenu = useCallback(() => {
		setOpenUploadMenu(false);
	}, []);

	return (
		<div className="app-content">
			<div className="app-header">
				<div>Helsinki City Bike App</div>
			</div>
			<div className="app-buttons">
				<ContentButton text="Journeys" to="/journeys"></ContentButton>
				<ContentButton text="Stations" to="/stations"></ContentButton>
				<ContentButton
					text="New"
					onClick={toggleUploadMenu}
				></ContentButton>
				<div
					className="app-buttons"
					style={{ display: openUploadMenu ? "block" : "none" }}
				>
					<ContentButton
						text="New Journey"
						to="/upload/journey"
						onClick={disableUploadMenu}
					></ContentButton>
					<ContentButton
						text="New Station"
						to="/upload/station"
						onClick={disableUploadMenu}
					></ContentButton>
				</div>
			</div>
			<Outlet></Outlet>
		</div>
	);
}
