export default {}

const app = document.querySelector('#app');

const a = document.querySelector('.link');

if (a instanceof HTMLAnchorElement) {
    a.href = '1';
}

if (app) {
    app.innerHTML = '11111';
}

console.log(55555)