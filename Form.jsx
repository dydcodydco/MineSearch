import React, { useCallback, useContext, useState } from "react";
import { TableContext, CODE_ACTION } from "./MineSearch";

const Form = () => {
	const { dispatch } = useContext(TableContext);
	const [row, setRow] = useState(10);
	const [cell, setCell] = useState(10);
	const [mine, setMine] = useState(20);

	const onChangeRow = useCallback((e) => {
		const {
			target: { value },
		} = e;
		setRow(value);
	}, []);

	const onChangeCell = useCallback((e) => {
		const {
			target: { value },
		} = e;
		setCell(value);
	}, []);

	const onChangeMine = useCallback((e) => {
		const {
			target: { value },
		} = e;
		setMine(value);
	}, []);

	const onSubmitForm = useCallback(
		(e) => {
			e.preventDefault();
			dispatch({ type: CODE_ACTION.START_GAME, row, cell, mine });
			// console.log(row, cell, mine);
		},
		[row, cell, mine]
	);
	return (
		<>
			<form onSubmit={onSubmitForm}>
				<input
					type='number'
					placeholder='세로'
					value={row}
					onChange={onChangeRow}
				/>
				<input
					type='number'
					placeholder='가로'
					value={cell}
					onChange={onChangeCell}
				/>
				<input
					type='number'
					placeholder='지뢰'
					value={mine}
					onChange={onChangeMine}
				/>
				<button>시작</button>
			</form>
		</>
	);
};
export default React.memo(Form);
