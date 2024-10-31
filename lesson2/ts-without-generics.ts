export default {};

function useNumberState(initial: number) {
	let value = initial;

	function setValue(newValue: number){
		value = newValue;
	}

	return [ value, setValue ] as const;
}

function useStringState(initial: string) {
	let value = initial;

	function setValue(newValue: string){
		value = newValue;
	}

	return [ value, setValue ] as const;
}

const [ cnt, setCnt ] = useNumberState(0);
const [ name, setName ] = useStringState('Dmitry');

document.body.innerHTML = `<strong onclick="${setCnt(cnt + 1)}">${cnt.toFixed(2)}</strong>`