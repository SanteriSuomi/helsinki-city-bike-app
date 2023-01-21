import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./errors/ErrorPage";
import DataPage from "./datapage/DataPage";
import { JOURNEYS_GRID_HEADERS, STATIONS_GRID_HEADERS } from "./Constants";
import { Journey, Station as TStation } from "./types/database";
import Station from "./components/single/Station";
import { abortableFetch } from "./utils/fetch";
import "./index.css";
import Upload from "./components/upload/Upload";

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
						element: <Upload></Upload>,
					},
					{
						path: "station",
						element: <Upload></Upload>,
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
