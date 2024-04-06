const username = localStorage.getItem('name');

if (!username) {
    window.location.replace('/');
    throw new Error('Username is required');
}

const socket = io({
    auth: {
        token: 'ABC-1231231',
        name: username
    }
});