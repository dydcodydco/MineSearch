import React, { createContext, useMemo, useReducer, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

export const CODE_ACTION = {
	START_GAME: "START_GAME",
	CLICK_CELL: "CLICK_CELL",
	CHANGE_QUESTION: "CHANGE_QUESTION",
	CHANGE_FLAG: "CHANGE_FLAG",
	CHANGE_NORMAL: "CHANGE_NORMAL",
	CLICK_MINE: "CLICK_MINE",
	SET_TIMER: "SET_TIMER",
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
	halted: true,
	dispatch: () => {},
});
const initialState = {
	tableData: [],
	halted: true,
	result: "",
	openedConut: 0,
	timer: 0,
	data: {
		row: 0,
		cell: 0,
		mine: 0,
	},
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
	if (state.halted && action.type !== CODE_ACTION.START_GAME) {
		return state;
	}
	switch (action.type) {
		case CODE_ACTION.START_GAME: {
			const { row, cell, mine } = action;
			const tableData = setMine({
				row: parseInt(row),
				cell: parseInt(cell),
				mine: parseInt(mine),
			});
			return {
				...state,
				tableData,
				halted: false,
				timer: 0,
				result: "",
				openedConut: 0,
				data: {
					row,
					cell,
					mine,
				},
			};
		}
		case CODE_ACTION.CLICK_CELL: {
			const { row, cell } = action;
			const tableData = [...state.tableData];
			tableData.forEach((d, i) => {
				d = [...tableData[i]];
			});
			let openedConut = 0;
			let isSuccess = false;

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
				openedConut++;
				// console.log("countArr", countArr);
				// console.log("count", count);
				// console.log(
				// 	state.data.row * state.data.cell - state.data.mine,
				// 	openedConut,
				// 	state.openedConut
				// );

				if (
					state.data.row * state.data.cell - state.data.mine ===
					openedConut + state.openedConut
				) {
					// console.log("정답");
					isSuccess = true;
				}
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
			const obj = {
				...state,
				tableData,
				openedConut: openedConut + state.openedConut,
			};
			if (isSuccess) {
				obj.result = `${state.timer} 초만에 성공했습니다.`;
				obj.halted = true;
			}
			return obj;
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
		case CODE_ACTION.CLICK_MINE: {
			const tableData = [...state.tableData];
			tableData[action.row] = [...tableData[action.row]];
			tableData[action.row][action.cell] = CODE_VALUE.CLICKED_MINE;
			return {
				...state,
				halted: true,
				tableData,
				result: `${state.timer} 초에 실패했습니다.`,
			};
		}
		case CODE_ACTION.SET_TIMER: {
			return {
				...state,
				timer: state.timer + 1,
			};
		}
		default:
			return state;
	}
};

const MineSearch = () => {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { tableData, result, halted, timer } = state;
	const value = useMemo(() => {
		return {
			tableData,
			halted,
			dispatch,
		};
	}, [tableData, halted]);

	useEffect(() => {
		if (halted) {
			return;
		}
		const interval = setInterval(() => {
			dispatch({ type: CODE_ACTION.SET_TIMER });
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [halted]);
	return (
		<>
			<TableContext.Provider value={value}>
				<h1>지뢰찾기</h1>
				<Form />
				{timer + "초"}
				<div></div>
				<Table />
				<div>{result}</div>
			</TableContext.Provider>
		</>
	);
};

export default MineSearch;
