export default {};

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

export type TUser = TAdminUser | TManagerUser | TClientUser;


function loadUsers(): TUser[]{
	return [
		{ type: 'admin', id: 1, login: 'admin', accessLevel: 5 },
		{ type: 'client', id: 2, login: 'cl1' },
		{ type: 'client', id: 3, login: 'cl2' },
		{ type: 'manager', id: 4, login: 'cl2', accessLevel: 1, roles: ['editor'] },
		{ type: 'manager', id: 5, login: 'cl2', accessLevel: 2, roles: ['editor', 'moderator'] }
	]
}

let users = loadUsers();

const uids = users.map(u => u.id);

const a = users.filter(userFilter('manager')).map(u => u.roles);
console.log(a);

function userFilter<T extends TUser['type']>(expectedType: T){
	return (u: TUser): u is Extract<TUser, { type: T }> => u.type === expectedType;
}

const b = 5;

type NZ = {
	a: typeof b
}

userFilter('admin')
userFilter('client')

const some: ReturnType<typeof loadUsers> | null = null

function makeFilter<T extends object, K extends keyof T, V extends T[K]>(prop: K, value: V){
	
}

makeFilter<TUser, 'type', 'admin'>('type', 'admin');


type TCat = {
	voice: 'myo',
	name: 'some'
}

type TDog = {
	voice: 'gav',
	name: '1'
}

type TAnimal = TCat | TDog;

makeFilter<TAnimal, 'voice', 'myo'>('voice', 'myo');

/* type n1 = 'a' | 'b' | 'd';
type n2 = 'b' | 'c';

type n3 = Extract<n1, n2>

type nz = Extract<TUser, { type: 'admin' }>

TUserManager extends { type: 'admin' }
TUClientManager extends { type: 'admin' }
TUAdminManager extends { type: 'admin' } */