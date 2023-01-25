import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./errors/ErrorPage.tsx";
import DataPage from "./datapage/DataPage.tsx";
import {
	JOURNEYS_GRID_HEADERS,
	JOURNEYS_UPLOAD_COLUMNS,
	STATIONS_GRID_HEADERS,
	STATIONS_UPLOAD_COLUMNS,
} from "./constants.ts";
import { Journey, Station as TStation } from "./types/database";
import Station from "./components/single/Station.tsx";
import { abortableFetch } from "./utils/fetch.ts";
import Upload from "./components/upload/Upload.tsx";
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
						items: TStation[];
					}>
						defaultSortData={{
							column: "id",
							order: "asc",
						}}
						apiRoute="stations"
						sortColumnHeaders={STATIONS_GRID_HEADERS}
						onItemClickNavigationData={{
							path: "/station",
							keys: ["id"],
						}}
						bottomText="Press a row for more information"
					></DataPage>
				),
			},
			{
				path: "/station/:id",
				element: <Station></Station>,
				loader: async ({ params }) => {
					let response;
					try {
						const fetchObject = abortableFetch(
							`${process.env.REACT_APP_API_URL}/stations/id-${params.id}`
						);
						response = await fetchObject.request;
					} catch (error) {
						console.log(error);
					}

					if (response?.ok) {
						const result = await response.json();
						return result.content[0];
					}
					return null;
				},
			},
			{
				path: "/upload",
				children: [
					{
						path: "journey",
						element: (
							<Upload
								columns={JOURNEYS_UPLOAD_COLUMNS}
								path="journeys"
							></Upload>
						),
					},
					{
						path: "station",
						element: (
							<Upload
								columns={STATIONS_UPLOAD_COLUMNS}
								path="stations"
							></Upload>
						),
					},
				],
			},
		],
	},
]);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);
