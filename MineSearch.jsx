import React, { createContext, useMemo, useReducer } from "react";
import Table from "./Table";
import Form from "./Form";

export const CODE_ACTION = {
	START_GAME: "START_GAEM",
	CLICK_CELL: "CLICK_CELL",
	CHANGE_QUESTION: "CHANGE_QUESTION",
	CHANGE_FLAG: "CHANGE_FLAG",
	CHANGE_NORMAL: "CHANGE_NORMAL",
	CLICK_MINE: "CLICK_MINE",
};
export const CODE_VALUE = {
	NORMAL: -1,
	QUESTION: -2,
	QUESTION_MINE: -3,
	FLAG: -4,
	FLAG_MINE: -5,
	CLICKED_MINE: -6,
	MINE: -7,
	OPENED: -8,
};

export const TableContext = createContext({
	tableData: [],
	dispatch: () => {},
});
const initialState = {
	tableData: [],
};

const setMine = ({ row, cell, mine }) => {
	const defaultArr = Array.from({ length: row * cell }, (_, i) => i);
	const mineArr = [];
	while (defaultArr.length > row * cell - mine) {
		mineArr.push(
			defaultArr.splice(Math.floor(Math.random() * defaultArr.length), 1)[0]
		);
	}

	const defaultTable = [...Array(cell)].map((d) => Array(row).fill(-1));
	mineArr.forEach((d, i) => {
		defaultTable[Math.floor(d / cell)][d % row] = CODE_VALUE.MINE;
	});

	// console.log("mineArr", mineArr);
	// console.log("defaultTable", defaultTable);

	return defaultTable;
};

const reducer = (state, action) => {
	switch (action.type) {
		case CODE_ACTION.START_GAME: {
			const { row, cell, mine } = action;
			const tableData = setMine({
				row: parseInt(row),
				cell: parseInt(cell),
				mine: parseInt(mine),
			});
			return { ...state, tableData };
		}
		case CODE_ACTION.CLICK_CELL: {
			const { row, cell, mine } = action;
			const tableData = [...state.tableData];
			tableData.forEach((d, i) => {
				d = [...tableData[i]];
			});

			tableData[action.row][action.cell] =
				tableData[action.row][action.cell] === CODE_VALUE.MINE
					? CODE_VALUE.CLICKED_MINE
					: CODE_VALUE.OPENED;
			return {
				...state,
			};
		}
		case CODE_ACTION.CHANGE_QUESTION: {
			const tableData = [...state.tableData];
			tableData[action.row] = [...tableData[action.row]];
			tableData[action.row][action.cell] =
				tableData[action.row][action.cell] === CODE_VALUE.MINE
					? CODE_VALUE.QUESTION_MINE
					: CODE_VALUE.QUESTION;
			return {
				...state,
				tableData,
			};
		}
		case CODE_ACTION.CHANGE_FLAG: {
			const tableData = [...state.tableData];
			tableData[action.row] = [...tableData[action.row]];
			tableData[action.row][action.cell] =
				tableData[action.row][action.cell] === CODE_VALUE.QUESTION_MINE
					? CODE_VALUE.FLAG_MINE
					: CODE_VALUE.FLAG;
			return {
				...state,
				tableData,
			};
		}
		case CODE_ACTION.CHANGE_NORMAL: {
			const tableData = [...state.tableData];
			tableData[action.row] = [...tableData[action.row]];
			tableData[action.row][action.cell] =
				tableData[action.row][action.cell] === CODE_VALUE.FLAG_MINE
					? CODE_VALUE.MINE
					: CODE_VALUE.NORMAL;
			return {
				...state,
				tableData,
			};
		}
		default:
			return state;
	}
};

const MineSearch = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { tableData } = state;
	const value = useMemo(() => {
		return {
			tableData,
			dispatch,
		};
	}, [tableData]);
	return (
		<>
			<TableContext.Provider value={value}>
				<h1>지뢰찾기</h1>
				<Form />
				<div></div>
				<Table />
			</TableContext.Provider>
		</>
	);
};

export default MineSearch;
