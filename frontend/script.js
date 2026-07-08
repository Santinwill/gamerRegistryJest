const API = 'http://localhost:3000/api';

/* ===========================
   GAMERS
=========================== */

async function addGamer() {

    const nickname = document.getElementById('nickname').value;
    const email = document.getElementById('email').value;

    await fetch(`${API}/gamers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, email })
    });

    document.getElementById('nickname').value = '';
    document.getElementById('email').value = '';

    loadGamers();
}

async function loadGamers() {

    const res = await fetch(`${API}/gamers`);
    const data = await res.json();

    const list = document.getElementById('gamerList');

    if (!list) return;

    list.innerHTML = '';

    data.forEach(g => {

        list.innerHTML += `
            <tr>
                <td>${g.id}</td>
                <td>${g.nickname}</td>
                <td>${g.email}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteGamer(${g.id})">
                        Excluir
                    </button>
                </td>
            </tr>
        `;
    });
}

async function deleteGamer(id) {

    await fetch(`${API}/gamers/${id}`, {
        method: 'DELETE'
    });

    loadGamers();
}

/* ===========================
   GAMES
=========================== */

async function addGame() {

    const title = document.getElementById('title').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;

    await fetch(`${API}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, genre, release_year: year })
    });

    document.getElementById('title').value = '';
    document.getElementById('genre').value = '';
    document.getElementById('year').value = '';

    loadGames();
}

async function loadGames() {

    const res = await fetch(`${API}/games`);
    const data = await res.json();

    const list = document.getElementById('gameList');

    if (!list) return;

    list.innerHTML = '';

    data.forEach(g => {

        list.innerHTML += `
            <tr>
                <td>${g.id}</td>
                <td>${g.title}</td>
                <td>${g.genre}</td>
                <td>${g.release_year}</td>
            </tr>
        `;
    });
}

/* ===========================
   GAMERS-GAMES
=========================== */

/* Carregar Associações */
async function loadSelects() {

    const gamers = await fetch(`${API}/gamers`).then(r => r.json());
    const games = await fetch(`${API}/games`).then(r => r.json());

    const gamerSelect = document.getElementById('gamerSelect');
    const gameSelect = document.getElementById('gameSelect');

    if (!gamerSelect || !gameSelect) return;

    gamerSelect.innerHTML = gamers
        .map(g => `<option value="${g.id}">${g.nickname}</option>`)
        .join('');

    gameSelect.innerHTML = games
        .map(g => `<option value="${g.id}">${g.title}</option>`)
        .join('');
}

/* Criar associação */
async function addAssociation() {

    const gamer_id = document.getElementById('gamerSelect').value;
    const game_id = document.getElementById('gameSelect').value;

    await fetch(`${API}/gamer-games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamer_id, game_id })
    });

    loadAssociations();
}


/* Listar associações */
async function loadAssociations() {

    const res = await fetch(`${API}/gamer-games`);
    const data = await res.json();

    const list = document.getElementById('associationList');

    if (!list) return;

    list.innerHTML = data.map(a => `
        <tr>
            <td>${a.nickname}</td>
            <td>${a.title}</td>
            <td>
                <button class="btn btn-danger btn-sm"
                    onclick="deleteAssociation(${a.gamer_id}, ${a.game_id})">
                    Remover
                </button>
            </td>
        </tr>
    `).join('');
}

/* Remover associação */
async function deleteAssociation(gamer_id, game_id) {

    await fetch(`${API}/gamer-games`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gamer_id, game_id })
    });

    loadAssociations();
}

/* ===========================
   AUTO LOAD
=========================== */

if (document.getElementById('gamerList')) loadGamers();
if (document.getElementById('gameList')) loadGames();
if (document.getElementById('associationList')) {
    loadSelects();
    loadAssociations();
}
