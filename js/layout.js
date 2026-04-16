/* layout.js — Roteador fetch do portal COBEA */
(function () {

 const PREFIX = 'COBEA Petrópolis - ';
 const routes = {
 'home': { title: PREFIX + 'Portal de Bem-Estar Animal', nav: 'home' },
 'me-viu': { title: PREFIX + 'Você me viu?', nav: 'me-viu' },
 'me-adota': { title: PREFIX + 'Me Adota?', nav: 'me-adota' },
 'rede-protecao': { title: PREFIX + 'Rede de Proteção', nav: 'rede-protecao' },
 'quero-ajudar': { title: PREFIX + 'Quero Ajudar', nav: 'quero-ajudar' },
 'denuncias': { title: PREFIX + 'Denúncias' },
 'cadastro-protetores': { title: PREFIX + 'Cadastro de Protetores' },
 'sou-tutor': { title: PREFIX + 'Sou o Responsável', nav: 'me-viu' },
 'quero-adotar': { title: PREFIX + 'Quero Adotar', nav: 'me-adota' },
 'campanhas': { title: PREFIX + 'Campanhas', nav: 'campanhas' },
 'faq': { title: PREFIX + 'Perguntas Frequentes', nav: 'faq' },
 'contato': { title: PREFIX + 'Contato', nav: 'contato' },
 'quem-somos': { title: PREFIX + 'Quem Somos', nav: 'quem-somos' }
 };

 const container = document.getElementById('page-content');
 let currentSrc = '';

 function loadPage(src) {
 fetch(src)
 .then(r => r.text())
 .then(html => {
 /* Corrige caminhos relativos de subpasta (../) para root */
 html = html.replace(/(["'])\.\.\//g, '$1');
 const doc = new DOMParser().parseFromString(html, 'text/html');
 container.innerHTML = doc.body.innerHTML;
 /* innerHTML não executa scripts — recriar cada elemento */
 container.querySelectorAll('script').forEach(old => {
 const s = document.createElement('script');
 s.textContent = old.textContent;
 old.parentNode.replaceChild(s, old);
 });
 window.scrollTo(0, 0);
 });
 }

 function navigate(hash) {
 const page = (hash || '').replace(/^#/, '') || 'home';
 
 // Se a rota existir no objeto de rotas
 if (routes[page]) {
 const route = routes[page];
 const src = 'pages/' + page + '.html';

 document.title = route.title;
 document.querySelectorAll('.nav-link[data-page]').forEach(link => {
 const active = link.dataset.page === route.nav;
 link.classList.toggle('active', active);
 active ? link.setAttribute('aria-current', 'page') : link.removeAttribute('aria-current');
 });

 if (currentSrc === src) return;
 currentSrc = src;
 loadPage(src);
 } 
 // Se NÃO for uma rota, mas for um ID existente na página (âncora interna)
 else if (document.getElementById(page)) {
 document.getElementById(page).scrollIntoView({ behavior: 'smooth' });
 }
 }

 window.addEventListener('hashchange', () => navigate(window.location.hash));
 navigate(window.location.hash);

 /* ---- Helper compartilhado: botões de página (usado pelos scripts das páginas) ---- */
 window.buildPageNums = function (wrap, active, total, onChange) {
 wrap.innerHTML = '';
 for (let p = 1; p <= total; p++) {
 const btn = document.createElement('button');
 btn.type = 'button';
 btn.className = 'adoption-page-number' + (p === active ? ' active' : '');
 btn.textContent = p;
 btn.addEventListener('click', () => onChange(p));
 wrap.appendChild(btn);
 }
 };

 /* ---- Hamburger menu ---- */
 const hamburger = document.querySelector('.navbar-hamburger');
 const navList = document.getElementById('navbar-nav-list');

 function closeMenu() {
 navList.classList.remove('is-open');
 hamburger.setAttribute('aria-expanded', 'false');
 hamburger.querySelector('i').className = 'fa-solid fa-bars';
 }

 if (hamburger && navList) {
 hamburger.addEventListener('click', () => {
 const open = navList.classList.toggle('is-open');
 hamburger.setAttribute('aria-expanded', String(open));
 hamburger.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
 });
 navList.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
 document.addEventListener('keydown', e => {
 if (e.key === 'Escape' && navList.classList.contains('is-open')) {
 closeMenu();
 hamburger.focus();
 }
 });
 }

})();