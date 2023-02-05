import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

interface IContentButtonProps {
	text?: string;
	to?: string;
	onClick?: () => void;
}

const ContentButton: FunctionComponent<IContentButtonProps> = ({
	text,
	to,
	onClick,
}) => {
	const navigate = useNavigate();
	return (
		<button
			onClick={() => {
				if (to) {
					navigate(to);
				}
				onClick?.();
			}}
		>
			{text}
		</button>
	);
};

export default ContentButton;
