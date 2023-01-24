import { FunctionComponent, useState } from "react";
import { UploadColumn, UploadColumnType } from "../../types/data.ts";
import "./upload.css";

interface IUploadProps {
	columns: UploadColumn[];
	path: string;
}

const Upload: FunctionComponent<IUploadProps> = ({ columns, path }) => {
	const [uploadObject, setUploadObject] = useState<Object>({});

	const uploadData = async () => {
		if (Object.keys(uploadObject).length !== columns.length) {
			return alert("Must fill all fields before uploading");
		}
		try {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/${path}`,
				{
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify(uploadObject),
				}
			);
			const result = await response.json();
			alert(result.message);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="upload-content">
			{columns.map((column) => {
				return (
					<div key={column.name} className="upload-input">
						<div>{column.name}</div>
						<input
							type={column.type}
							onChange={(
								e: React.FormEvent<HTMLInputElement>
							) => {
								setUploadObject({
									...uploadObject,
									[column.key]:
										column.type === UploadColumnType.NUMBER
											? Number(e.currentTarget.value)
											: e.currentTarget.value,
								});
							}}
						></input>
					</div>
				);
			})}
			<button className="upload-button" onClick={uploadData}>
				Upload
			</button>
		</div>
	);
};

export default Upload;
