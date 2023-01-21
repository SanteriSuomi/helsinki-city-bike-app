import { FunctionComponent } from "react";
import { Header } from "../../types/grid";
import GridItem from "./GridItem";
import "./grid.css";

interface IGridProps {
	headers: Header[];
	items?: any[];
	onItemClickNavigationData?: { path: string; keys: string[] };
}

const Grid: FunctionComponent<IGridProps> = ({
	headers,
	items,
	onItemClickNavigationData,
}) => {
	const parseText = (header: Header, text: string) => {
		if (header.isDate) {
			return new Date(text).toLocaleDateString();
		} else if (header.isNumber) {
			return Number.parseFloat(text).toFixed(header.isNumber.round);
		}
		return text;
	};

	return (
		<div className="grid">
			{headers.map((header, index) => {
				return (
					<GridItem
						key={header.text}
						text={header.text}
						gridColumn={index + 1}
						gridRow={1}
					></GridItem>
				);
			})}
			{items?.map((item: any, dataIndex: number) => {
				return (
					<div key={dataIndex} className="grid-row">
						{headers.map((header, rowIndex) => {
							return (
								<GridItem
									key={dataIndex + rowIndex}
									text={parseText(header, item[header.key])}
									gridColumn={rowIndex + 1}
									gridRow={dataIndex + 2}
									onItemClickNavigationData={
										onItemClickNavigationData
									}
									item={item}
								></GridItem>
							);
						})}
					</div>
				);
			})}
		</div>
	);
};

export default Grid;
