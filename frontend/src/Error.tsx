import { useRouteError } from "react-router-dom";
import "./styles/error.css";

export default function Error() {
	const error = useRouteError() as any;
	console.error(error);

	return (
		<div className="error-content">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error?.statusText || error?.message}</i>
			</p>
		</div>
	);
}
