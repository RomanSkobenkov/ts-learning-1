export default {};

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

function loadUser(): TAdminUser | TManagerUser | TClientUser {
    return {
        type: 'admin',
        id: 1,
        login: 'some',
        accessLevel: 5
    }
}

let u1 = loadUser();

if(u1.type === 'admin'){
    console.log(u1.accessLevel);
}