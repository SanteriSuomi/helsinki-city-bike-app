import {
	ChangeEvent,
	PropsWithChildren,
	useCallback,
	useEffect,
	useState,
} from "react";
import Grid from "../components/grid/Grid";
import Selector from "../components/Selector";
import { MIN_DATAPAGE_UPDATE_COUNT, SORT_ORDER_HEADERS } from "../Constants";
import { DefaultSortData, DataPageInfo, AbortableFetch } from "../types/data";
import { Header } from "../types/grid";
import { abortableFetch } from "../utils/fetch";
import "./datapage.css";

interface IDataPageProps {
	defaultSortData: DefaultSortData;
	apiRoute: string;
	sortColumnHeaders: Header[];
}

let initialUpdateCount = 0;
let fetchObject: AbortableFetch | null;

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
	const [searchQuery, setSearchQuery] = useState("");

	const [maxItemsPerPage] = useState(
		Number(process.env.REACT_APP_MAX_ITEMS_PER_PAGE)
	);

	const fetchData = async (
		sortData: DefaultSortData,
		enableLoading?: boolean,
		searchQuery?: string
	) => {
		if (fetchObject) {
			fetchObject.abort();
			fetchObject = null;
		}
		if (enableLoading) setLoading(true);

		let response;
		try {
			fetchObject = abortableFetch(
				`${process.env.REACT_APP_API_URL}/${props.apiRoute}${
					searchQuery ?? ""
				}?column=${sortData.column}&order=${
					sortData.order
				}&offset=${paginateOffset}&limit=${maxItemsPerPage}`
			);
			response = await fetchObject.request;
			fetchObject = null;
		} catch (error) {
			console.log(error);
		}

		if (response?.ok) {
			const result = await response.json();
			setData(result.content);
			if (enableLoading) setLoading(false);
		}
	};

	useEffect(() => {
		initialUpdateCount = 0;
		setSort(props.defaultSortData);
		setPaginateOffset(0);
		fetchData(sort, true);
	}, [props.defaultSortData]);

	useEffect(() => {
		initialUpdateCount += 1;
		if (initialUpdateCount >= MIN_DATAPAGE_UPDATE_COUNT) {
			fetchData(sort);
		}
	}, [sort]);

	useEffect(() => {
		initialUpdateCount += 1;
		if (initialUpdateCount >= MIN_DATAPAGE_UPDATE_COUNT) {
			fetchData(sort);
		}
	}, [paginateOffset]);

	useEffect(() => {
		initialUpdateCount += 1;
		if (initialUpdateCount >= MIN_DATAPAGE_UPDATE_COUNT) {
			fetchData(sort, true, searchQuery ? `/search/${searchQuery}` : "");
		}
	}, [searchQuery]);

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

	const handleSearch = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	}, []);

	return (
		<div className="data-page-content">
			<div className="data-page-filters-wrap">
				<div className="data-page-filters">
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
				<div>
					<div>Search</div>
					<input
						className="data-page-search"
						type="text"
						onChange={handleSearch}
					></input>
				</div>
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
							{Math.max(
								data.totalCount / maxItemsPerPage,
								1
							)?.toFixed(0)}{" "}
							(
							{`${data.totalCount?.toFixed(0)} ${
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
