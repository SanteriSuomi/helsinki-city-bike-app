import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import "./grid_item.css";

interface IGridDataProps {
	text: string | number;
	gridColumn: number;
	gridRow: number;
	item?: any;
	onItemClickNavigationData?: { path: string; keys: string[] };
}

const GridItem: FunctionComponent<IGridDataProps> = ({
	text,
	gridColumn,
	gridRow,
	item,
	onItemClickNavigationData,
}) => {
	const navigate = useNavigate();
	return (
		<div
			className="grid-item"
			style={{ gridColumn: gridColumn, gridRow: gridRow }}
			onClick={() => {
				if (onItemClickNavigationData) {
					navigate(
						`${
							onItemClickNavigationData.path
						}${onItemClickNavigationData.keys?.map(
							(key: string) => {
								return `/${item[key]}`;
							}
						)}`
					);
				}
			}}
		>
			{text}
		</div>
	);
};

export default GridItem;
