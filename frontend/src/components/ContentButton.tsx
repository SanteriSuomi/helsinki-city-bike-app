import { FunctionComponent } from "react";
import { Link } from "react-router-dom";

interface IContentButtonProps {
	text: string;
	to: string;
}

const ContentButton: FunctionComponent<IContentButtonProps> = ({
	text,
	to,
}) => {
	return (
		<div>
			<Link to={to}>
				<button>{text}</button>
			</Link>
		</div>
	);
};

export default ContentButton;
