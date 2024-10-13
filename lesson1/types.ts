export default {}

/* let q: any = 1;
q = '1' */

const a: number | string = 1;
const b: string = '1';
const c: boolean = true;
const d: null = null;
const e: undefined = undefined;
const f: object = {};

const g: Number = 1;
const j: Date = new Date();
const i: RegExp = /.*/;

const n: false = false;
const k: 1 = 1;
const o: 'admin' = 'admin';

/* const p: never = 1;

function throwNotAuthError() : never{
	throw new Error();
}
 */

type TSumFn = (x: number, y: number) => number

const sum: TSumFn = (x: number, y: number): number => {
    return x + y;
}

sum(2, 3)

function sum2(x, y: number) : number{
    return x + y;
}

/* [a, b, c, d, e, f, g, i, i] */

type TUser = {
    id: number,
    name: string
}

/* class User implements TUser{

} */

const admin: TUser = {
    id: 1,
    name: 'Dmitry'
}

console.log(typeof j);
console.log(j instanceof Date);
console.log(typeof admin);
/* console.log(admin instanceof TUser);
 */

/* | null = null;
a.toFixed(2); */


class AsyncMath{
    x: number;
    y: number;

    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
    }

    sum(onDone: (result: number) => void){
        setTimeout(() => {
            onDone(this.x + this.y)
        }, 200);
    }
}

const m1 = new AsyncMath(10, 20);
m1.sum(x => { console.log(x) });