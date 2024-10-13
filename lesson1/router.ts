export default {};

type Component = () => string

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

type RouteRecordRedirect = RouteRecordBase & {
    type: 'redirect',
    redirect: string
}

type RouteRecord = RouteRecordComponent | RouteRecordRedirect;

createRouter([
    {
        no: '1',
        type: 'component',
        path: '/',
        component: () => 'home page'
    }
])

function createRouter(routes: RouteRecord[]){
    routes
}