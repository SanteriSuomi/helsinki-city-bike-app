import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./errors/ErrorPage";
import DataPage from "./datapage/DataPage";
import { JOURNEYS_GRID_HEADERS, STATIONS_GRID_HEADERS } from "./Constants";
import { Journey, Station } from "./types/database";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App></App>,
		errorElement: <ErrorPage></ErrorPage>,
		children: [
			{
				path: "/journeys",
				element: (
					<DataPage<{
						totalCount: number;
						items: Journey[];
					}>
						defaultSortData={{
							column: "departure_date",
							order: "asc",
						}}
						apiRoute="journeys"
						sortColumnHeaders={JOURNEYS_GRID_HEADERS}
					></DataPage>
				),
			},
			{
				path: "/stations",
				element: (
					<DataPage<{
						totalCount: number;
						items: Station[];
					}>
						defaultSortData={{
							column: "id",
							order: "asc",
						}}
						apiRoute="stations"
						sortColumnHeaders={STATIONS_GRID_HEADERS}
					></DataPage>
				),
			},
		],
	},
]);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);
