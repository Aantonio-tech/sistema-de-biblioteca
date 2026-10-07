const U = "biblioteca_users";
const B = "biblioteca_books";
const L = "biblioteca_loans";
const LG = "biblioteca_logged_user";

/* =========================
   LOCAL STORAGE
========================= */

const get = (key, defaultValue = []) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? defaultValue;
    } catch {
        return defaultValue;
    }
};

const set = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const uid = () => {
    return Date.now().toString(36) +
        Math.random().toString(36).slice(2, 7);
};

/* =========================
   DADOS INICIAIS
========================= */

function seed() {

    if (!localStorage.getItem(U)) {
        set(U, [
            {
                id: "u1",
                nome: "João da Silva",
                email: "joao@email.com",
                telefone: "(11) 99999-1111",
                senha: "1234"
            },
            {
                id: "u2",
                nome: "Maria Oliveira",
                email: "maria@email.com",
                telefone: "(11) 98888-2222",
                senha: "1234"
            }
        ]);
    }

    if (!localStorage.getItem(B)) {
        set(B, [
            {
                id: "b1",
                titulo: "Dom Casmurro",
                autor: "Machado de Assis",
                categoria: "Romance",
                ano: 1899
            },
            {
                id: "b2",
                titulo: "O Pequeno Príncipe",
                autor: "Antoine de Saint-Exupéry",
                categoria: "Literatura",
                ano: 1943
            },
            {
                id: "b3",
                titulo: "Capitães da Areia",
                autor: "Jorge Amado",
                categoria: "Romance",
                ano: 1937
            }
        ]);
    }

    if (!localStorage.getItem(L)) {
        set(L, []);
    }
}

seed();

/* =========================
   INICIALIZAÇÃO
========================= */

document.addEventListener("DOMContentLoaded", () => {

    const menu = document.querySelector(".menu-toggle");

    if (menu) {
        menu.onclick = () => {
            menu.parentElement.classList.toggle("menu-open");
        };
    }

    updateLogin();
    stats();
    login();
    cadastro();
    books();
    users();
    loans();
    contact();
});

/* =========================
   USUÁRIO LOGADO
========================= */

function logged() {

    try {
        return JSON.parse(localStorage.getItem(LG));
    } catch {
        return null;
    }
}

function updateLogin() {

    const element = document.getElementById("loginLink");

    if (!element) return;

    const user = logged();

    if (user) {

        const primeiroNome = user.nome.split(" ")[0];

        element.textContent = "Olá, " + primeiroNome;
        element.href = "#";

        element.onclick = (event) => {

            event.preventDefault();

            if (confirm("Deseja sair da conta?")) {

                localStorage.removeItem(LG);

                location.reload();
            }
        };
    }
}

/* =========================
   ESTATÍSTICAS
========================= */

function stats() {

    const bookCount = document.getElementById("bookCount");
    const userCount = document.getElementById("userCount");

    if (bookCount) {
        bookCount.textContent = get(B).length;
    }

    if (userCount) {
        userCount.textContent = get(U).length;
    }
}

/* =========================
   LOGIN
========================= */

function login() {

    const form = document.getElementById("loginForm");

    if (!form) return;

    form.onsubmit = (event) => {

        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value
            .trim()
            .toLowerCase();

        const senha = document
            .getElementById("loginSenha")
            .value;

        const users = get(U);

        const user = users.find(
            item =>
                item.email.toLowerCase() === email &&
                item.senha === senha
        );

        const message = document.getElementById("loginMsg");

        if (!user) {

            if (message) {
                message.textContent =
                    "E-mail ou senha incorretos.";

                message.style.color = "var(--danger)";
            }

            return;
        }

        /* SALVA USUÁRIO LOGADO */

        set(LG, {
            id: user.id,
            nome: user.nome,
            email: user.email
        });

        /* VOLTA PARA A HOME */

        location.href = "index.html";
    };
}

/* =========================
   CADASTRO
========================= */

function cadastro() {

    const form = document.getElementById("cadastroForm");

    if (!form) return;

    form.onsubmit = (event) => {

        event.preventDefault();

        let users = get(U);

        const nome = document
            .getElementById("cadNome")
            .value
            .trim();

        const email = document
            .getElementById("cadEmail")
            .value
            .trim()
            .toLowerCase();

        const telefone = document
            .getElementById("cadTelefone")
            .value
            .trim();

        const senha = document
            .getElementById("cadSenha")
            .value;

        const message = document.getElementById("cadMsg");

        /* VERIFICA E-MAIL */

        if (
            users.some(
                user => user.email.toLowerCase() === email
            )
        ) {

            if (message) {
                message.textContent =
                    "Este e-mail já está cadastrado.";

                message.style.color = "var(--danger)";
            }

            return;
        }

        /* CRIA USUÁRIO */

        users.push({
            id: uid(),
            nome: nome,
            email: email,
            telefone: telefone,
            senha: senha
        });

        set(U, users);

        if (message) {

            message.textContent =
                "Cadastro realizado com sucesso!";

            message.style.color = "var(--primary)";
        }

        setTimeout(() => {
            location.href = "login.html";
        }, 700);
    };
}

/* =========================
   LIVROS
========================= */

function books() {

    const list = document.getElementById("livrosLista");

    if (!list) return;

    const form = document.getElementById("livroForm");
    const wrap = document.getElementById("livroFormWrap");

    const novoBtn = document.getElementById("novoLivroBtn");
    const cancelarBtn = document.getElementById("cancelarLivro");

    if (novoBtn) {

        novoBtn.onclick = () => {

            form.reset();

            document.getElementById("livroId").value = "";

            document.getElementById("formLivroTitulo").textContent =
                "Cadastrar livro";

            wrap.classList.remove("hidden");
        };
    }

    if (cancelarBtn) {

        cancelarBtn.onclick = () => {
            wrap.classList.add("hidden");
        };
    }

    if (form) {

        form.onsubmit = (event) => {

            event.preventDefault();

            let books = get(B);

            const id =
                document.getElementById("livroId").value;

            const book = {
                id: id || uid(),

                titulo:
                    document.getElementById("livroTitulo").value.trim(),

                autor:
                    document.getElementById("livroAutor").value.trim(),

                categoria:
                    document.getElementById("livroCategoria").value.trim(),

                ano:
                    document.getElementById("livroAno").value
            };

            if (id) {

                books = books.map(item =>
                    item.id === id ? book : item
                );

            } else {

                books.push(book);
            }

            set(B, books);

            wrap.classList.add("hidden");

            renderBooks();
            stats();
        };
    }

    const search = document.getElementById("buscaLivro");

    if (search) {
        search.oninput = renderBooks;
    }

    renderBooks();
}

/* =========================
   MOSTRAR LIVROS
========================= */

function renderBooks() {

    const list = document.getElementById("livrosLista");

    if (!list) return;

    const search =
        document.getElementById("buscaLivro");

    const query =
        (search?.value || "").toLowerCase();

    const books = get(B).filter(book => {

        const text =
            `${book.titulo} ${book.autor} ${book.categoria}`;

        return text.toLowerCase().includes(query);
    });

    if (!books.length) {

        list.innerHTML =
            `<div class="empty">
                Nenhum livro encontrado.
            </div>`;

        return;
    }

    list.innerHTML = `
        <table class="data-table">

            <thead>

                <tr>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Categoria</th>
                    <th>Ano</th>
                    <th>Ações</th>
                </tr>

            </thead>

            <tbody>

                ${books.map(book => `

                    <tr>

                        <td>
                            <strong>
                                ${esc(book.titulo)}
                            </strong>
                        </td>

                        <td>
                            ${esc(book.autor)}
                        </td>

                        <td>
                            ${esc(book.categoria || "-")}
                        </td>

                        <td>
                            ${esc(book.ano || "-")}
                        </td>

                        <td class="table-actions">

                            <button
                                class="small-btn"
                                onclick="editBook('${book.id}')"
                            >
                                Alterar
                            </button>

                            <button
                                class="small-btn delete"
                                onclick="deleteBook('${book.id}')"
                            >
                                Excluir
                            </button>

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>
    `;
}

/* =========================
   ALTERAR LIVRO
========================= */

window.editBook = function (id) {

    const book = get(B).find(
        item => item.id === id
    );

    if (!book) return;

    document.getElementById("livroId").value = book.id;
    document.getElementById("livroTitulo").value = book.titulo;
    document.getElementById("livroAutor").value = book.autor;
    document.getElementById("livroCategoria").value =
        book.categoria || "";
    document.getElementById("livroAno").value =
        book.ano || "";

    document.getElementById("formLivroTitulo").textContent =
        "Alterar livro";

    document
        .getElementById("livroFormWrap")
        .classList.remove("hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

/* =========================
   EXCLUIR LIVRO
========================= */

window.deleteBook = function (id) {

    if (!confirm("Excluir este livro?")) {
        return;
    }

    const books = get(B).filter(
        book => book.id !== id
    );

    set(B, books);

    renderBooks();
    stats();
};

/* =========================
   USUÁRIOS
========================= */

function users() {

    const list =
        document.getElementById("usuariosLista");

    if (!list) return;

    const search =
        document.getElementById("buscaUsuario");

    if (search) {
        search.oninput = renderUsers;
    }

    renderUsers();
}

function renderUsers() {

    const list =
        document.getElementById("usuariosLista");

    if (!list) return;

    const search =
        document.getElementById("buscaUsuario");

    const query =
        (search?.value || "").toLowerCase();

    const users = get(U).filter(user => {

        const text =
            `${user.nome} ${user.email}`;

        return text.toLowerCase().includes(query);
    });

    list.innerHTML = `
        <table class="data-table">

            <thead>

                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Telefone</th>
                </tr>

            </thead>

            <tbody>

                ${users.map(user => `

                    <tr>

                        <td>
                            <strong>
                                ${esc(user.nome)}
                            </strong>
                        </td>

                        <td>
                            ${esc(user.email)}
                        </td>

                        <td>
                            ${esc(user.telefone || "-")}
                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>
    `;
}

/* =========================
   EMPRÉSTIMOS
========================= */

function loans() {

    const form =
        document.getElementById("emprestimoForm");

    if (!form) return;

    fill();

    renderLoans();

    form.onsubmit = (event) => {

        event.preventDefault();

        const user =
            get(U).find(
                item =>
                    item.id ===
                    document.getElementById("empUsuario").value
            );

        const book =
            get(B).find(
                item =>
                    item.id ===
                    document.getElementById("empLivro").value
            );

        if (!user || !book) {
            return;
        }

        const loans = get(L);

        loans.push({
            id: uid(),
            usuario: user.nome,
            livro: book.titulo,
            data:
                document.getElementById("empData").value,
            status: "Em andamento"
        });

        set(L, loans);

        const message =
            document.getElementById("empMsg");

        if (message) {
            message.textContent =
                "Empréstimo registrado com sucesso!";
        }

        form.reset();

        fill();
        renderLoans();
    };
}

/* =========================
   PREENCHER SELECTS
========================= */

function fill() {

    const userSelect =
        document.getElementById("empUsuario");

    const bookSelect =
        document.getElementById("empLivro");

    const date =
        document.getElementById("empData");

    if (userSelect) {

        userSelect.innerHTML =
            get(U).map(user => `
                <option value="${user.id}">
                    ${esc(user.nome)}
                </option>
            `).join("");
    }

    if (bookSelect) {

        bookSelect.innerHTML =
            get(B).map(book => `
                <option value="${book.id}">
                    ${esc(book.titulo)}
                </option>
            `).join("");
    }

    if (date && !date.value) {

        date.value =
            new Date()
                .toISOString()
                .slice(0, 10);
    }
}

/* =========================
   MOSTRAR EMPRÉSTIMOS
========================= */

function renderLoans() {

    const list =
        document.getElementById("emprestimosLista");

    if (!list) return;

    const loans = get(L);

    if (!loans.length) {

        list.innerHTML = `
            <div class="empty">
                Nenhum empréstimo registrado.
            </div>
        `;

        return;
    }

    list.innerHTML = `
        <table class="data-table">

            <thead>

                <tr>
                    <th>Usuário</th>
                    <th>Livro</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Ação</th>
                </tr>

            </thead>

            <tbody>

                ${loans.map(loan => `

                    <tr>

                        <td>
                            ${esc(loan.usuario)}
                        </td>

                        <td>
                            ${esc(loan.livro)}
                        </td>

                        <td>
                            ${esc(loan.data)}
                        </td>

                        <td>
                            ${esc(loan.status)}
                        </td>

                        <td>

                            ${
                                loan.status === "Em andamento"
                                    ? `
                                    <button
                                        class="small-btn"
                                        onclick="returnLoan('${loan.id}')"
                                    >
                                        Devolver
                                    </button>
                                    `
                                    : "—"
                            }

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>
    `;
}

/* =========================
   DEVOLVER LIVRO
========================= */

window.returnLoan = function (id) {

    const loans = get(L).map(loan => {

        if (loan.id === id) {

            return {
                ...loan,
                status: "Devolvido"
            };
        }

        return loan;
    });

    set(L, loans);

    renderLoans();
};

/* =========================
   CONTATO
========================= */

function contact() {

    const form =
        document.getElementById("contatoForm");

    if (!form) return;

    form.onsubmit = (event) => {

        event.preventDefault();

        const message =
            document.getElementById("contatoMsg");

        if (message) {

            message.textContent =
                "Mensagem enviada com sucesso!";

            message.style.color =
                "var(--primary)";
        }

        form.reset();
    };
}

/* =========================
   SEGURANÇA HTML
========================= */

function esc(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,

        character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[character]
    );
}