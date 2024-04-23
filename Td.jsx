import React, { useCallback, useContext } from "react";
import { CODE_ACTION, CODE_VALUE, TableContext } from "./MineSearch";
const onTdText = (data) => {
	switch (data) {
		case CODE_VALUE.NORMAL:
		case CODE_VALUE.OPENED:
			return "";
		case CODE_VALUE.QUESTION:
		case CODE_VALUE.QUESTION_MINE:
			return "?";
		case CODE_VALUE.FLAG:
		case CODE_VALUE.FLAG_MINE:
			return "!";
		case CODE_VALUE.CLICKED_MINE:
			return "펑";
		case CODE_VALUE.MINE:
			return "X";
		default:
			return data || "";
	}
};
const onTdStyle = (data) => {
	// console.log("getTedStyled");
	let backgroundColor = "white";
	switch (data) {
		case CODE_VALUE.OPENED:
		case CODE_VALUE.CLICKED_MINE:
			backgroundColor = "white";
			break;
		case CODE_VALUE.QUESTION:
		case CODE_VALUE.QUESTION_MINE:
			backgroundColor = "yellow";
			break;
		case CODE_VALUE.FLAG:
		case CODE_VALUE.FLAG_MINE:
			backgroundColor = "red";
			break;
		case CODE_VALUE.NORMAL:
		case CODE_VALUE.MINE:
			backgroundColor = "#555";
			break;
		default:
			backgroundColor = "white";
			break;
	}
	return { backgroundColor };
};

const Td = ({ rowIndex, cellIndex }) => {
	// console.log("getTedStyled");
	const { tableData, dispatch, halted } = useContext(TableContext);
	const onClickTd = useCallback(() => {
		if (
			[
				CODE_VALUE.OPENED,
				CODE_VALUE.CLICKED_MINE,
				CODE_VALUE.QUESTION,
				CODE_VALUE.QUESTION_MINE,
				CODE_VALUE.FLAG,
				CODE_VALUE.FLAG_MINE,
			].includes(tableData[rowIndex][cellIndex])
		)
			return;
		if (tableData[rowIndex][cellIndex] > -1) {
			return;
		}
		if (tableData[rowIndex][cellIndex] === CODE_VALUE.MINE) {
			dispatch({
				type: CODE_ACTION.CLICK_MINE,
				row: rowIndex,
				cell: cellIndex,
			});
			return;
		}
		dispatch({
			type: CODE_ACTION.CLICK_CELL,
			row: rowIndex,
			cell: cellIndex,
		});
	}, [tableData[rowIndex][cellIndex], halted]);

	const onRightClickTd = useCallback(
		(e) => {
			e.preventDefault(0);
			if (
				[CODE_VALUE.OPENED, CODE_VALUE.CLICKED_MINE].includes(
					tableData[rowIndex][cellIndex]
				)
			)
				return;
			if (tableData[rowIndex][cellIndex] > -1) {
				return;
			}
			// console.log("onRightClickTd");
			switch (tableData[rowIndex][cellIndex]) {
				case CODE_VALUE.NORMAL:
				case CODE_VALUE.MINE:
					dispatch({
						type: CODE_ACTION.CHANGE_QUESTION,
						row: rowIndex,
						cell: cellIndex,
					});
					break;
				case CODE_VALUE.QUESTION:
				case CODE_VALUE.QUESTION_MINE:
					dispatch({
						type: CODE_ACTION.CHANGE_FLAG,
						row: rowIndex,
						cell: cellIndex,
					});
					break;
				case CODE_VALUE.FLAG:
				case CODE_VALUE.FLAG_MINE:
					dispatch({
						type: CODE_ACTION.CHANGE_NORMAL,
						row: rowIndex,
						cell: cellIndex,
					});
					break;
			}
		},
		[tableData[rowIndex][cellIndex], halted]
	);

	return (
		<RealTd
			onClickTd={onClickTd}
			onRightClickTd={onRightClickTd}
			data={tableData[rowIndex][cellIndex]}
		/>
	);
};

export default Td;

const RealTd = React.memo(({ onClickTd, onRightClickTd, data }) => {
	// console.log("real td renderd");
	return (
		<td
			onClick={onClickTd}
			style={onTdStyle(data)}
			onContextMenu={onRightClickTd}
		>
			{onTdText(data)}
		</td>
	);
});
