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

users.filter(isManager).map(u => u.accessLevel)

/* users.filter(u => {
	if(u.type === 'manager'){
		u.accessLevel
	}
}) */

const u1 = users[0];

u1

if(isManager(u1)){
	u1.accessLevel
}

function isManager(user: TUser) : user is TManagerUser{
	return user.type === 'manager';
}