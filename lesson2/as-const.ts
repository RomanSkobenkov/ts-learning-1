let some = 'some';
const other = 'other';

let names: string[] = ['Dmitry', 'Taras', 'Rifat', 'Tatyana'];

let userDeposit: [ string, number ] = [ 'admin', 2000/* , 1 */ ]; // tuple

let some1 = 'some' as const;
let arr = [ 1, (nv: number) => nv ] as const;

let some2: 'some' = 'some';
let arr1: [ number, (nv: number) => number ] = [ 1, (nv: number) => nv ];

let isOpen = true as const;
/* isOpen = false; */