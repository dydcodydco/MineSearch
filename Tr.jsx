import React, { useContext } from "react";
import Td from "./Td.jsx";
import { TableContext } from "./MineSearch.jsx";

const Tr = ({ rowIndex }) => {
	const { tableData } = useContext(TableContext);
	return (
		<tr>
			{tableData[0] &&
				tableData[0].map((d, i) => (
					<Td key={i} rowIndex={rowIndex} cellIndex={i} data={d} />
				))}
		</tr>
	);
};

export default Tr;
