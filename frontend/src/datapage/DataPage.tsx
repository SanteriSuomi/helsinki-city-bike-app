import {
	ChangeEvent,
	PropsWithChildren,
	useCallback,
	useEffect,
	useState,
} from "react";
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

let fetchPromise: Promise<void> | null;

export default function DataPage<TData>(
	props: PropsWithChildren<IDataPageProps>
) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<DataPageInfo<TData>>({
		totalCount: 0,
		items: [],
	});
	const [sort, setSort] = useState<DefaultSortData>(props.defaultSortData);
	const [paginateOffset, setPaginateOffset] = useState(0);

	const [maxItemsPerPage] = useState(
		Number(process.env.REACT_APP_MAX_ITEMS_PER_PAGE)
	);

	const fetchData = async (
		sortData: DefaultSortData,
		loadingIcon: boolean
	) => {
		if (fetchPromise) return fetchPromise;
		if (loadingIcon) {
			setLoading(true);
		}
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/${props.apiRoute}?column=${sortData.column}&order=${sortData.order}&offset=${paginateOffset}&limit=${maxItemsPerPage}`
		);
		if (response.ok) {
			const result = await response.json();
			setData(result.content);
			if (loadingIcon) {
				setLoading(false);
			}
		}
		fetchPromise = null;
	};

	useEffect(() => {
		setSort(props.defaultSortData);
	}, [props.defaultSortData]);

	useEffect(() => {
		fetchData(sort, true);
	}, [sort]);

	useEffect(() => {
		fetchPromise = fetchData(sort, false);
	}, [paginateOffset]);

	// Wrap in callbacks to prevent function from being recreated every re-render
	const handleSortByColumn = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			setSort({
				column: event.target.value,
				order: sort.order,
			});
		},
		[sort.order]
	);

	const handleSortOrder = useCallback(
		(event: ChangeEvent<HTMLSelectElement>) => {
			setSort({
				column: sort.column,
				order: event.target.value,
			});
		},
		[sort.column]
	);

	const handlePagination = useCallback(
		(event: any) => {
			const offset = Number(event.target.value);
			if (
				paginateOffset + offset >= 0 &&
				paginateOffset + offset <= data.totalCount
			) {
				setPaginateOffset(paginateOffset + offset);
			}
		},
		[data.totalCount, paginateOffset]
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
					<div className="data-page-footer">
						<div>
							Page {paginateOffset / maxItemsPerPage + 1} out of{" "}
							{(data.totalCount / maxItemsPerPage).toFixed(0)} (
							{`${data.totalCount.toFixed(0)} ${
								props.apiRoute
							} in total`}
							)
						</div>
						<div className="data-page-pagination-buttons">
							<button
								value={-maxItemsPerPage}
								onClick={handlePagination}
							>
								⇐
							</button>
							<button
								value={maxItemsPerPage}
								onClick={handlePagination}
							>
								⇒
							</button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
