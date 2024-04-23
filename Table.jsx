import React, { useContext } from "react";
import Tr from "./Tr";
import { TableContext } from "./MineSearch";

const Table = () => {
	const { tableData } = useContext(TableContext);
	return (
		<table>
			<tbody>
				{tableData.map((d, i) => (
					<Tr key={i} rowIndex={i} rowData={d} />
				))}
			</tbody>
		</table>
	);
};

export default Table;
