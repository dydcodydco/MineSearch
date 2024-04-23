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

			const clickCell = ({ row, cell }) => {
				// 이미 열렸거나 -1보다 크면 return
				if (
					tableData[row][cell] === CODE_VALUE.OPENED ||
					tableData[row][cell] > -1
				) {
					return;
				}

				// 근처에 지뢰 몇개 있는지 찾기
				const countArr = [];
				if (tableData[row - 1]) {
					countArr.push({
						code: tableData[row - 1][cell - 1],
						row: row - 1,
						cell: cell - 1,
					});
					countArr.push({
						code: tableData[row - 1][cell],
						row: row - 1,
						cell,
					});
					countArr.push({
						code: tableData[row - 1][cell + 1],
						row: row - 1,
						cell: cell + 1,
					});
				}
				countArr.push({
					code: tableData[row][cell - 1],
					row,
					cell: cell - 1,
				});
				countArr.push({
					code: tableData[row][cell + 1],
					row,
					cell: cell + 1,
				});
				if (tableData[row + 1]) {
					countArr.push({
						code: tableData[row + 1][cell - 1],
						row: row + 1,
						cell: cell - 1,
					});
					countArr.push({
						code: tableData[row + 1][cell],
						row: row + 1,
						cell,
					});
					countArr.push({
						code: tableData[row + 1][cell + 1],
						row: row + 1,
						cell: cell + 1,
					});
				}

				// 근처에 몇개의 지뢰가 있는지 표시
				const count = countArr.filter((d) =>
					new Set([
						CODE_VALUE.MINE,
						CODE_VALUE.QUESTION_MINE,
						CODE_VALUE.FLAG_MINE,
					]).has(d.code)
				).length;
				tableData[row][cell] = count;

				console.log("countArr", countArr);
				console.log("count", count);

				// 근처에 지뢰가 없으면 주위에 있는 cell들에게
				// 재취 함수 호출
				if (count === 0) {
					countArr
						.filter((d) => d.code !== undefined)
						.forEach((d) => {
							clickCell({ row: d.row, cell: d.cell });
						});
				} else {
					return;
				}
			};
			clickCell({ row, cell });
			return {
				...state,
				tableData,
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
