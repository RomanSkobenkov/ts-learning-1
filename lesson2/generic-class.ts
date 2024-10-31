import { TClientUser } from "./predicat";

export default {};

class Storage<T extends { id: number }>{
	items: Array<T>

	constructor(){
		this.items = [];
	}

	add(item: T){
		this.items.push(item);
	}

	remove(id: number){
		this.items = this.items.filter(i => i.id !== id);
	}

	get(id: number){
		return this.items.find(i => i.id === id);
	}

	clean(){
		this.items = [];
	}
}

const usersList = new Storage<TClientUser>();

usersList.add({ id: 1, login: 'a', type: 'client' });
usersList.add({ id: 1, login: 'admin', type: 'client' });

/* type Some = {
	name: string
}

const someList = new Storage<Some>(); */
/* const some1List = new Storage<number>(); */
/* some1List.add()
 */