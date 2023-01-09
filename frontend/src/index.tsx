import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Journeys from "./journeys/Journeys";
import Error from "./Error";
import "./styles/index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App></App>,
		errorElement: <Error></Error>,
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
