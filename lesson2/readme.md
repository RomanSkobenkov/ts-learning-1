# Урок 1

```tsx
type TUserBase = {
    id: number,
    login: string
}

type TAdminUser = TUserBase & {
    type: 'admin',
    accessLevel: number
}

type TManagerUser = TUserBase & {
    type: 'manager',
    accessLevel: number,
    roles: string[]
}

type TClientUser = TUserBase & {
    type: 'client',
}

type TUser = TAdminUser | TManagerUser | TClientUser;

function loadUser(): TUser[] {
    return [
        { type: 'admin', id: 1, login: 'admin', accessLevel: 5},
        { type: 'client', id: 2, login: 'some'},
        { type: 'client', id: 3, login: 'some2'},
        { type: 'manager', id: 444, login: 'manager', accessLevel: 5, roles: ['t', 'e']},
        { type: 'manager', id: 444, login: 'manager', accessLevel: 88, roles: ['y', 'u']},
    ]
}

let users = loadUser();

// в этом коде на месте точек TS не понимает с каким типом работает
// и не видит свойств roles, accessLevel
// хотя как будто и явно отфильтровали TManagerUser
users.filter(u => u.type === 'manager').map(u => u.......
```

Грязные варианты решения:

```tsx
// 1
users.filter(u => u.type === 'manager').map(u as TManagerUser => u.......

// 2
users.filter(u => {
    if (u.type === 'manager') {
        u....
    }
}
```

---

# Предикат

Так, кстати, тоже не сработает:

```tsx
const u1 = users[0];

if (isManager(u1)) {
    u1...
}

function isManager(user: TUser) {
    return user.type === 'manager';
}
```

Но вот таааааак:

```tsx
const u1 = users[0];

if (isManager(u1)) {
    u1...
}

// тут магия, это называется предикат (predicate)
// вся фишка в возвращаемом значении
// без типизации возвращается просто boolean и TS это ничего не говорит об объекте
function isManager(user: TUser): user is TManagerUser {
    return user.type === 'manager';
}
// такие функции ещё называют custom type guard
```

Т.е. предикат - это штука для функций, возвращающих boolean. И если это true - значит объект, переданный в функцию, принадлежит к такому то типу.

Пример с фильтром тогда переделываем так:

```tsx
users.filter(isManager).map(u => u...)
```

---

# Дженерики

Проблема, которую они решают (явное дублирование):

```jsx
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
```

Первый признак дженерика - угловые скобки после названия функции:

```tsx
function func<>() {}
```

Также дженерики могут быть и у типов:

```tsx
Array<>

// Пример
Array<string>
// сокращенно:
string[]
// но сокращённый вариант не даст сделать так:
Array<string | number>
// например
const a: Array<string | number> = [1, 'a', true]
```

Чаще всего дженерик обозначают через букву T:

```tsx
function func<T>() {}

// если несколько - дальше по алфавиту через запятую:
function func<T, U, V, W>() {}

// можно и человеческим названием, так например:
function func<ValuelType>() {}
// но чаще пишут в одну букву
```

И вот проблемный код выше уже на дженериках:

```tsx
function useState<ValueType>(initial: ValueType) {
	let value = initial;

	function setValue(newValue: ValueType){
		value = newValue;
	}

	return [ value, setValue ] as const;
}

// на самом деле это сокращённая версия
const [ cnt, setCnt ] = useState(0);
// и предполагается так:
const [ cnt, setCnt ] = useState<number>(0);
// на самом деле это сокращённая версия
const [ name, setName ] = useState('Dmitry');
// и предполагается так:
const [ name, setName ] = useState<string>('Dmitry');
// но тут работает автовычисление дженериков

// а можно вот так ещё кстати
const [ name, setName ] = useState<string | number>('Dmitry');
// и коллбэк тогда тоже сможет работать с string | number

// а вот здесь указываем тип дженерика уже явно
// чтобы TS понимал какой объект и структура должны быть проверены
const [ user, setUser ] = useState<TClientUser>({
	// не даст нарушить структуру / передать неверные | неполные значения
	type: 'client',
	id: 1,
	login: 'guest'
});

/* setUser({

}) */

document.body.innerHTML = `<strong onclick="${setCnt(cnt + 1)}">${cnt.toFixed(2)}</strong>`
```

И по итогу это работает так: дженерик получает нужный тип переменной и раскатывает его по всей функции + причисляет возвращаемый результат и переменную, которой он присваивается, к нужному типу.

## Дженерики в классах

Допустим есть такой класс:

```jsx
class Storage {
    items: Array<object>

    constructor(){
        this.items = [];
    }

    add(item: object){
        this.items.push(item);
    }

    clean(){
        this.items = [];
    }
}
```

В него сейчас можно запихнуть любые объекты любой структуры:

```jsx
const usersList = new Storage();

usersList.add({ id: 1});
usersList.add({ id: 1, name: 'admin', blabla: 'bla' });
```

Добавим дженерики:

```jsx
class Storage<T> {
    items: Array<T>

    constructor(){
        this.items = [];
    }

    add(item: T){
        this.items.push(item);
    }

    clean(){
        this.items = [];
    }
}
```

И укажем его при создании, например `TClientUser`:

```tsx
const usersList = new Storage<TClientUser>();

// и теперь мы можем передать в него только объекты
// которые соответствуют TClientUser
usersList.add({ id: 1, login: 'a', type: 'client' });
usersList.add({ id: 1, login: 'admin', type: 'client' });
```

Дженерик можно задать и на лету:

```tsx
const onlyIdObjects = new Storage<{ id: number }>();
// принимает только объекты состоящие только из ключа id и типом number
onlyIdObjects.add({id: 5});

// можно и примитивы сюда
const onlyNumbers = new Storage<number>();
```

---

# Массивы и картежи

Картеж (`tuple`) - это строгая последовательность элементов из строго ограниченного количества. Т.е. это такой частный подвид массива.

Пример:

```jsx
let userDeposit: [ string, number ] = [ 'admin', 2000];
// и сюда нельзя положить ни пустой массив, ни массив большей / меньшей длины
// ни массив из других типов данных
```

---

# Сужение типов

```jsx
let some1 = 'some' as const;

// такая запись равносильна 
let some1: 'some' = 'some'
// или 
const some1 = 'some'
// в отличии от 
let some1 = 'some'
// которая равносильна
let some1: string = 'some'
```

Создаём например такой массив:

```jsx
let arr = [ 1, (nv: number) => nv ];
```

Изначально в него можно положить сколько угодно элементов, он принимает внутрь на любую позицию числа или функцию такого-то типа, т.к. у нас при инициализации массив состоит из числа и функции.

А как только мы напишем вот так:

```jsx
let arr = [ 1, (nv: number) => nv ] as const;
```

переменная станет картежем, где на первой позиции - число 1, а на второй - наша функция.

Это удобно например для сокращения, т.к. вот такой код выглядит гораздо хуже:

```jsx
let arr: [ number, (nv: number) => number ] = [ 1, (nv: number) => nv ];
```

Также и в это примере:

```jsx
// вместо того, чтобы писать функции 
// длиннющее определение (т.к. у нас переменная + описание коллбэка) 
// возвращаемого значения через :
function useState<ValueType>(initial: ValueType) {
	let value = initial;

	function setValue(newValue: ValueType){
		value = newValue;
	}
	// можно просто сделать as const для return
	return [ value, setValue ] as const;
}
```

## Сужение дженериков

Если напишем так:

```tsx
class Storage<T extends object> { // только здесь
    items: Array<T>

    constructor(){
        this.items = [];
    }

    add(item: T){
        this.items.push(item);
    }

    clean(){
        this.items = [];
    }
}
```

То уже не сможем так:

```tsx
const onlyNumbers = new Storage<number>();
```

Потому что класс теперь принимает только типы похожие на объект.

Можно ещё сузить:

```tsx
class Storage<T extends { id: number }>{
	items: Array<T>
...
...
...
```

И теперь класс будет принимать только объекты, у которых есть id. И теперь мы можем создавать методы, которые опираются на значение id объекта:

```tsx
class Storage<T extends { id: number }>{
	items: Array<T>

	constructor(){
		this.items = [];
	}

	...

	remove(id: number){
		this.items = this.items.filter(i => i.id !== id);
	}

	get(id: number){
		return this.items.find(i => i.id === id);
	}

	...
}
```

От неправильного типа тоже не сможем создать, кстати:

```tsx
 type Some = {
  // нет id
	name: string
}

const someList = new Storage<Some>(); // будет материться
```

Кстати, если убрать необходимость id из дженерика, то TS начнёт ругаться в методах, в которых мы на него опираемся:

!https://i.imgur.com/tGSlQDt.png

Ещё TS умеет сам формировать допустимые значения из уже имеющихся. Пример:

!https://i.imgur.com/0dB5Gkr.png

Если быть точнее, он взял их из типов, которые выше по коду:

```tsx
export type TUserBase = {
	id: number,
	login: string,
}

export type TAdminUser = TUserBase & {
	type: 'admin',
	accessLevel: number
}

export type TManagerUser = TUserBase & {
	type: 'manager',
	accessLevel: number,
	roles: string[]
}

export type TClientUser = TUserBase & {
	type: 'client'
}
```

Т.е. нужный тип значения можно причислить через ключ другого типа. Пример:

```tsx
export type TManagerUser = TUserBase & {
	type: 'manager',
	accessLevel: number,
	roles: string[]
}

let bla: TManagerUser['accessLevel'] = 4; // только number
```

# TS Utility Types

У TS есть ряд типов-хелперов. Полный список можно увидеть здесь:

https://www.typescriptlang.org/docs/handbook/utility-types.html

## **Required<Type>**

Позволяет сказать, что все параметры в объекте обязательны. Пример:

```tsx
interface Props {
  a?: number;
  b?: string;
}
 
const obj: Props = { a: 5 }; // всё ок
 
const obj2: Required<Props> = { a: 5 }; // ошибка, т.к. теперь a и b обязательны
```

## **ReturnType<Type>**

Допустим у нас есть переменная, которая пока `null`, но в будущем мы хотим положить в неё то, что возвращает функция. Вот как это можно сделать:

```tsx
function loadUsers(): TUser[]{
    return [
        { type: 'admin', id: 1, login: 'admin', accessLevel: 5 },
        { type: 'client', id: 2, login: 'cl1' },
        { type: 'client', id: 3, login: 'cl2' },
        { type: 'manager', id: 4, login: 'cl2', accessLevel: 1, roles: ['editor'] },
        { type: 'manager', id: 5, login: 'cl2', accessLevel: 2, roles: ['editor', 'moderator'] }
    ]
}

// только функцию надо использовать как тип
// с помощью TS оператора typeof (это не JS typeof, а именно TS)
// т.е. мы тут хотим, чтобы TS воспринимал эту функцию как тип
const some: ReturnType<typeof loadUsers> | null = null
```

И по итогу переменная some у нас тут может быть либо `TUser[]`, либо `null`

!https://i.imgur.com/hT3kh2r.png

## **Extract<Type, Union>**

Возвращает пересекающиеся значения, пример:

!https://i.imgur.com/k2gjlnG.png

!https://i.imgur.com/AlYTUfW.png

Соответственно, мы можем первым передать тип, в котором что-то ищем, а вторым - наше искомое значение. Пример:

```tsx
// найдём среди всех TUser того, у type которого 'admin'
type nz = Extract<TUser, { type: 'admin' }> 
```

На самом деле он довольно прост и реализуется с помощью двух дженериков, вот так:

!https://i.imgur.com/mLRSKsh.png

# Пример по всем темам урока

Решаем все проблемы с .map, с нормальной фильтрацией.

```tsx
function userFilter<T extends TUser['type']>(expectedType: T) {
    return (u: TUser): u is Extract<TUser, { type: T }> => u.type === expectedType;
}

userFilter('admin')
userFilter('client')
```