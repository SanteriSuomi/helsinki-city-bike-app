import { FunctionComponent } from "react";
import { Header } from "../types/grid";

interface ISelectorProps {
	title: string;
	headers: Header[];
	onChange: (event: React.ChangeEvent<HTMLSelectElement>) => any;
}

const Selector: FunctionComponent<ISelectorProps> = ({
	title,
	headers,
	onChange,
}) => {
	return (
		<div>
			<div>{title}</div>
			<select onChange={onChange}>
				{headers.map((header) => {
					return (
						<option key={header.dbKey} value={header.dbKey}>
							{header.text}
						</option>
					);
				})}
			</select>
		</div>
	);
};

export default Selector;
