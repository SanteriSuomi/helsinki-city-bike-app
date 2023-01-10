import { Fragment, FunctionComponent } from "react";
import { Header, Sort } from "../../../types/grid";
import GridItem from "./GridItem";
import "./grid.css";

interface IGridProps {
	headers: Header[];
	data?: any[];
	setSort: (obj: Sort) => void;
}

const Grid: FunctionComponent<IGridProps> = ({ headers, data, setSort }) => {
	return (
		<div className="grid">
			{headers.map((header, index) => {
				return (
					<GridItem
						key={header.text}
						text={header.text}
						gridColumn={index + 1}
						gridRow={1}
						setSort={setSort}
					></GridItem>
				);
			})}
			{data?.map((data: any, dataIndex: number) => {
				return (
					<Fragment key={dataIndex}>
						{headers.map((header, rowIndex) => {
							return (
								<GridItem
									key={dataIndex + rowIndex}
									text={data[header.dbKey]}
									gridColumn={rowIndex + 1}
									gridRow={dataIndex + 2}
								></GridItem>
							);
						})}
					</Fragment>
				);
			})}
		</div>
	);
};

export default Grid;
