import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Journeys from "./journeys/Journeys";
import ErrorPage from "./errors/ErrorPage";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App></App>,
		errorElement: <ErrorPage></ErrorPage>,
		children: [
			{
				path: "/journeys",
				element: <Journeys></Journeys>,
			},
		],
	},
]);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(<RouterProvider router={router} />);
