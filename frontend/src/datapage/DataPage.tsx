import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import Grid from "../components/grid/Grid";
import Selector from "../components/Selector";
import { SORT_ORDER_HEADERS } from "../Constants";
import { DefaultSortData, DataPageInfo } from "../types/data";
import { Header } from "../types/grid";
import "./datapage.css";

interface IDataPageProps {
	defaultSortData: DefaultSortData;
	apiRoute: string;
	sortColumnHeaders: Header[];
}

export default function DataPage<TData>(
	props: PropsWithChildren<IDataPageProps>
) {
	const [loading, setLoading] = useState(true);
	const [data, setData] = useState<DataPageInfo<TData>>();
	const [sort, setSort] = useState<DefaultSortData>(props.defaultSortData);

	useEffect(() => {
		setSort(props.defaultSortData);
	}, [props.defaultSortData]);

	useEffect(() => {
		const fetchData = async (sortData: DefaultSortData) => {
			setLoading(true);
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/${props.apiRoute}?column=${sortData.column}&order=${sortData.order}&offset=0&limit=20`
			);
			if (response.ok) {
				const result = await response.json();
				setData(result.content);
				setLoading(false);
			}
		};
		fetchData(sort);
	}, [sort]);

	// Wrap in callbacks to prevent function from being recreated every re-render
	const handleSortByColumn = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			setSort({
				column: event.target.value,
				order: sort.order,
			});
		},
		[sort.order]
	);

	const handleSortOrder = useCallback(
		(event: React.ChangeEvent<HTMLSelectElement>) => {
			setSort({
				column: sort.column,
				order: event.target.value,
			});
		},
		[sort.column]
	);

	return (
		<div className="data-page-content">
			<div className="data-page-selectors">
				<Selector
					title="Sort By Column"
					headers={props.sortColumnHeaders}
					onChange={handleSortByColumn}
				></Selector>
				<Selector
					title="Sort Order"
					headers={SORT_ORDER_HEADERS}
					onChange={handleSortOrder}
				></Selector>
			</div>

			{loading ? (
				<div className="data-page-loading">Loading...</div>
			) : (
				<>
					<Grid
						headers={props.sortColumnHeaders}
						data={data?.items}
						setSort={setSort}
					></Grid>
					<div>
						Page {1} out of{" "}
						{data && (data.totalCount / 20).toFixed(0)} (
						{`${data?.totalCount?.toFixed(0)} ${
							props.apiRoute
						} in total`}
						)
					</div>
				</>
			)}
		</div>
	);
}
