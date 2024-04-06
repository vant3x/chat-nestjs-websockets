const username = localStorage.getItem('name');

if (!username) {
    window.location.replace('/');
    throw new Error('Username is required');
}

const labelStatusOnline = document.querySelector('#status-online');
const labelStatusOffline = document.querySelector('#status-offline');

const usersULElement = document.querySelector('ul');
const form = document.querySelector('form');
const input = document.querySelector('input');
const chatElement = document.querySelector('#chat');

const renderUsers = (users) => {
    usersULElement.innerHTML = '';
    users.forEach((user) => {
        const liElement = document.createElement('li');
        liElement.innerText = user.name;
        usersULElement.appendChild(liElement);
    })
}

const renderMessages = (payload) => {
    const { userId, message, name } = payload;
    console.log(message)

    const divElement = document.createElement('div');
    divElement.classList.add('message');

    if (userId !== socket.id) {
        divElement.classList.add('incoming');
    }

    divElement.innerHTML = `
    <small className="font-weight-bold" style="font-weight:bold">
        ${name}
    <small>
    <p  style="font-weight:normal">
        ${message}
    </p>`;
    chatElement.appendChild(divElement);

    chatElement.scrollTop = chatElement.scrollHeight;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const message = input.value;
    input.value = '';

    socket.emit('send-message', message);
})


const socket = io({
    auth: {
        token: 'ABC-1231231',
        name: username
    }
});


socket.on('connect', () => {
    console.log('Conectado');
    labelStatusOnline.classList.remove('hidden');
    labelStatusOffline.classList.add('hidden');
});

socket.on('disconnect', () => {
    console.log('Desconectado');
    labelStatusOnline.classList.add('hidden');

    labelStatusOffline.classList.remove('hidden');

});

socket.on('welcome-batcave', (payload) => {
    console.log(payload);
}) 

socket.on('on-clients-changed', renderUsers);

socket.on('on-message', payload => renderMessages(payload))