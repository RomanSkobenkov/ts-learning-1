import { TClientUser } from "./predicat";

export default {};

/* string[]
const a: Array<string | number> = [1, 'a', true] */


function useState<ValueType>(initial: ValueType) {
	let value = initial;

	function setValue(newValue: ValueType){
		value = newValue;
	}

	return [ value, setValue ] as const;
}

const [ cnt, setCnt ] = useState(0);
const [ name, setName ] = useState('Dmitry');
const [ user, setUser ] = useState<TClientUser>({
	type: 'client',
	id: 1,
	login: 'guest'
});

useState(true)

/* setUser({

}) */

document.body.innerHTML = `<strong onclick="${setCnt(cnt + 1)}">${cnt.toFixed(2)}</strong>`