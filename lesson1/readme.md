# Урок 1

Быстрый старт TS проекта на vite:

```bash
npm create vite@latest project-name -- --template vanilla-ts
```

# Файл настроек `tsconfig.json`

```json
{
  "compilerOptions": {
    /* то, в какую версию JS будет собираться проект */
    /* но т.к. используем vite уровень поддержки определяет он */
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    /* lib подсказывает TS в какой среде он работает */
    /* так, через DOM, он например поймёт, что ему доступны window, document и т.д. */
    /* т.е. если TS на что-то ругается (не видит), то возможно причина здесь */
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    /* noEmit значит, что TS сам файлы не собирает */
    "noEmit": true,

    /* Linting */
    /* strict можно описать как объект с более мелким разбиением настроек */
    /* strictNullChecks например */
    /* но в целом всё рекомендуется оставлять в true, но иногда и переключают */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  /* Путь до директории с файлами TS, которые нужно анализировать */
  "include": ["src"]
}

```

---

Любой файл в TS следует делать модулем (писать хотя бы `*export default* {}`), потому что иначе TS может посчитать, что разные файлы находятся в одной зоне видимости (и будет ругаться на что не нужно). Кроме тех случаев, когда файл не должен быть модулем (редкий случай).

---

# Про сборку

Команда `tsc` расшифровывается как TypeScript compilation.

Проверить код через tsc можно так:

```tsx
tsc --noEmit
```

Можно создать команду для проверки кода типа:

```tsx
"scripts": {
    "check": "tsc --noEmit"
  },
```

Проверять при билде и только когда нет ошибок ts - собирать проект:

```tsx
  "scripts": {
    "build": "tsc && vite build",
  },
```

---

# Типы переменных

Примеры присваивания простых типов:

```tsx
const a: number = 1;
const b: string = '1';
const bArray: string[] = ['1', 'bla'];
const z: number | string = 1; // один из двух (нескольких) типов
const c: boolean = true;
const d: null = null;
const e: undefined = undefined;
const f: object = {};

const g: Number = 1; // number лучше (не привязываться к классу Number от JS)
const j: Date = new Date();
const i: RegExp = /.*/;
```

Пример создания своего типа:

```tsx
type TUser = {
	id: number,
	name: string
}

const admin: TUser = {
	id: 1,
	name: 'Dmitry'
}
```

Важно помнить, что в runtime коде никакого `TUser` не будет (ни объекта, ни класса).

Т.е. например переменную `j` мы можем проверить через `j instanceof Date`, а вот с `admin` и `TUser` так уже не получится.

---

## Литеральные типы

В ts переменную можно ограничить не только типом, но и конкретным значением. Примеры:

```tsx
const n: false = false;
const k: 1 = 1;
const o: 'admin' = 'admin';
```

---

## Объединение типов

Помогает сократить код, когда у нескольких типов есть одинаковые свойства. Пример:

```tsx
type TAdminUser =  {
    type: 'admin',
    id: number,
    login: string,
    accessLevel: number
}

type TManagerUser =  {
    type: 'manager',
    id: number,
    login: string,
    accessLevel: number
}

type TClientUser =  {
    type: 'client'
    id: number,
    login: string,
}
```

Здесь можно вынести как минимум `id` и `login`. Таким образом:

```tsx
type TUser = {
    id: number,
    login: string
}

type TAdminUser = TUser & {
    type: 'admin',
    accessLevel: number
}

type TManagerUser = TUser & {
    type: 'manager',
    accessLevel: number
}

type TClientUser = TUser & {
    type: 'client'
}
```

А вот так делать нельзя (свойство `no`):

```tsx
type RouteRecordBase = {
    path: string,
    no: string,
}

type RouteRecordComponent = RouteRecordBase & {
    no: number,
    type: 'component',
    component: () => string,
    children?: RouteRecord[]
}
```

Потому что TS будет считать, что в `no` должно быть И число, И строка (`no: string & number`).

---

## Типизация функций

Примеры типизации функций:

```tsx
type TSumFn = (x: number, y: number) => number

const sum: TSumFn = (x: number, y: number): number => {
	return x + y;
}

sum(2, 3)

function sum2(x: number, y: number) : number{
	return x + y;
}

/////////////////////////////////////

class AsyncMath{
	x: number;
	y: number;

	constructor(x: number, y: number){
		this.x = x;
		this.y = y;
	}

	// пример типизации callback функции (onDone - принимает number, возвращает void)
	sum(onDone: (result: number) => void){
		setTimeout(() => {
			onDone(this.x + this.y)
		}, 200);
	}
}

const m1 = new AsyncMath(10, 20);
m1.sum(x => { console.log(x) });
```

---

## Type Guard

TS всегда идёт по наихудшему сценарию. Т.е. если функция будет возвращать один из нескольких типов, то TS будет видеть только те свойства, которые для них являются общими.

```tsx
export default {};

type TAdminUser =  {
    id: number,
    login: string,
    accessLevel: number
}

type TManagerUser =  {
    id: number,
    login: string,
}

function loadUser(): TAdminUser | TManagerUser {
    return {
        id: 1,
        login: 'some',
        accessLevel: 5
    }
}

// в такой ситуации у u1 не будет видно accessLevel.
// TS смотрит на фунцию loadUser и какие типы она может вернуть
// accessLevel нет у TManagerUser
// а мы не знаем точно, что вернётся именно TAdminUser
let u1 = loadUser();
```

Пруф:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b94332b7-d160-4eae-b355-38712ab0a156/5f39328f-e612-40f2-831f-74476b603dac/image.png)

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b94332b7-d160-4eae-b355-38712ab0a156/d36b0c12-67f9-4716-91a6-5288af1bf5ff/image.png)

Можно обходить так (и другими способами: проверять на `undefined` и т.д.). И тут `TS`  уже понимает, что переменная эта - `TAdminUser`:

```tsx
if ('accessLevel' in u1) {
    console.log(u1.accessLevel);
}
```

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b94332b7-d160-4eae-b355-38712ab0a156/5b250589-4859-4f8e-aa77-34437552f0d3/image.png)

Но при появлении новых типов, новых ключей, пересекающихся ключей и т.д. всё это станет неудобным.

Вот так мы уже не сможем точно понять менеджер наш пользователь или админ:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b94332b7-d160-4eae-b355-38712ab0a156/bc1c1518-b7c5-41fd-9b98-f63ca9b2c404/image.png)

И тут на помощь приходят литеральные типы, когда типом переменной является конкретное значение:

```tsx
export default {};

type TAdminUser =  {
    type: 'admin', // литеральный тип, а не какой-то там string
    id: number,
    login: string,
    accessLevel: number
}

type TManagerUser =  {
    type: 'manager', // литеральный тип
    id: number,
    login: string,
    accessLevel: number
}

type TClientUser =  {
    type: 'client' // литеральный тип
    id: number,
    login: string,
}

function loadUser(): TAdminUser | TManagerUser | TClientUser {
    return {
        type: 'admin', // литеральный тип
        id: 1,
        login: 'some',
        accessLevel: 5
    }
}

let u1 = loadUser();

if(u1.type === 'admin'){ // проверка литерального типа
    console.log(u1.accessLevel);
}
```

Более сложный пример с литеральными типами данных с схематичным роутером. Здесь литералы помогают нам ограничить нелогичное добавление компонентов в редиректы например. Есть интересная цикличность между `RouteRecordComponent` и `RouteRecord`, но в целом всё логично и понятно.

```tsx
export default {};

type Component = () => string
 
type RouteRecordBase = {
	path: string
}

type RouteRecordComponent = RouteRecordBase & {
	type: 'component',
	component: () => string,
	children?: RouteRecord[]
}

type RouteRecordRedirect = RouteRecordBase & {
	type: 'redirect',
	redirect: string
}

type RouteRecord = RouteRecordComponent | RouteRecordRedirect;

createRouter([
	{
		type: 'component',
		path: '/',
		component: () => 'home page'
	},
	{
		type: 'redirect',
		path: '/old',
		redirect: '/',
		/* component: () => 'home old' */
	},
	{
		type: 'redirect',
		path: '/products',
		redirect: '/catalog',
		/* children: [
			{
				path: '/',
				component: () => '1'
			}
		] */
	}
])

function createRouter(routes: RouteRecord[]){
	routes
}
```

---

## Тип never

Запрещает записывать значения в переменную.

Функция, возвращающая `never` **никогда не должна дойти до своего завершения**. Должна выбросить `exception`, `error`, что угодно. Поэтому это не то же самое, что вернуть `void`.

Решение проблемы с роутером с помощью типа `never`:

```tsx
type Component = () => string
 
type RouteRecordBase = {
	path: string
}

type RouteRecordComponent = RouteRecordBase & {
	component: () => string,
	children?: RouteRecord[],
	redirect?: never
}

type RouteRecordRedirect = RouteRecordBase & {
	redirect: string,
	component?: never,
	children?: never
}

type RouteRecord = RouteRecordComponent | RouteRecordRedirect;

createRouter([
	{
		path: '/',
		component: () => 'home page',
	},
	{
		path: '/old',
		redirect: '/',
		/* component: () => 'home old' */
	},
	{
		path: '/products',
		/* redirect: '/catalog', */
		component: () => 'home old',
		children: [
			{
				path: '/',
				component: () => '1'
			}
		]
	}
])

function createRouter(routes: RouteRecord[]){
	routes
}
```

---

# Работа с DOM

TS не уверен, что указанный элемент существует на странице:

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b94332b7-d160-4eae-b355-38712ab0a156/18856511-85b4-41f3-8ab1-86b0b5c7f061/image.png)

Сказать ему об этом можно добавив восклицательный знак при присвоении. Такая запись значит, что мы уверены, что результат выражения никогда не вернёт `null`:

```tsx
const app = document.querySelector('#app')!;
```

Или по старинке:

```tsx
const app = document.querySelector('#app');

if (app) {
    app.innerHTML = '11111';
}
```

![image.png](https://prod-files-secure.s3.us-west-2.amazonaws.com/b94332b7-d160-4eae-b355-38712ab0a156/73904026-48db-4ed6-8516-c9522ac39bdc/image.png)

---

TS не даст нам доступ например к href переменной, если он не уверен, что элемент является ссылкой. Как ему об этом сказать:

```tsx
// TS поймёт по способу, которым мы получаем здесь ссылку
// но такие способы получения уже никто не использует
// [0] потому что getElementsByTagName возвращает массив элементов
const a = document.getElementsByTagName('a')![0];

// Можно через указание типа
const a = <HTMLAnchorElement> document.querySelector('.link');

// или такое
const a = document.querySelector('.link') as HTMLAnchorElement;

// но оба варианта выше не очень, т.к. мы оставляем TS без работы
// по сути мы заставляем его считать переменную за HTMLAnchorElement
// и не важно, что он думает
```

Лучший вариант такой:

```tsx
// здесь, за скобками, а - это ещё Element | null

if (a instanceof HTMLAnchorElement) {
		// а здесь это уже HTMLAnchorElement
    a.href = '1';
}
```

---

# Type и Interface

На данный момент это практически одно и то же, т.е. следующие строки имеют одинаковое значение:

```tsx
type TUser = {
	id: number,
	email: string
}

type TAdminUser = TUser & {
	role: string
}

interface User{
	id: number,
	email: string
}

interface AdminUser extends User{
	role: string
}

class User implements TAdminUser{

}
```

Но вот так например можно сделать только с помощью типа:

```tsx
type A = string | number;
```

+ объединение типов через &

Зато интерфейсы можно расширять ниже по коду:

```tsx
type TUser = {
	id: number,
	email: string
}

type TAdminUser = TUser & {
	role: string
}

interface User{
	id: number,
	email: string
}

interface AdminUser extends User{
	role: string
}

type TAdminUser{
	some: string // так нельзя
}

interface AdminUser{
	some: string // а вот так можно. И интерфейс не переопределится, а дополнится
}

 const a: AdminUser = {
	id: 1,
	email: 'a',
	role: 'admin',
	// заставит дописать и значение some тоже
}

```

И вроде такое поведение интерфейсов - говно, но. Иногда интерфейсы действительно нужно расширять, чаще всего глобальные. Как пример - Window. Как правильно - позже.