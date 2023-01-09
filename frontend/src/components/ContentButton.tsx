import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import "../styles/contentbutton.css";

interface IContentButtonProps {
	text: string;
	to: string;
}

const ContentButton: FunctionComponent<IContentButtonProps> = ({
	text,
	to,
}) => {
	return (
		<div className="content-button-content">
			<Link to={to}>
				<button>{text}</button>
			</Link>
		</div>
	);
};

export default ContentButton;
