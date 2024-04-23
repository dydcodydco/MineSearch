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
			console.log(row, cell, mine);
		},
		[row, cell, mine]
	);
	return (
		<>
			<form onSubmit={onSubmitForm}>
				<input type='number' value={row} onChange={onChangeRow} />
				<input type='number' value={cell} onChange={onChangeCell} />
				<input type='number' value={mine} onChange={onChangeMine} />
				<button>실행</button>
			</form>
		</>
	);
};
export default Form;
