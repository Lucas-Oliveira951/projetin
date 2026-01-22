
// Seleciona os elementos principais
const botaoHtml = document.querySelector('.botao-menu-versao-html')
const botaoPhp = document.querySelector('.botao-menu-versao-php')
const menuLateral = document.querySelector('.menu-lateral')
const background = document.querySelector('.background')

// Abre / fecha o menu ao clicar no botão

function toggleMenu() {
    botaoHtml?.classList.toggle('ativo');
    botaoPhp?.classList.toggle('ativo');
    menuLateral.classList.toggle('ativo');
    background.classList.toggle('ativo');
}

// Fecha o menu ao clicar no fundo escurecido
function closeMenu() {
    botaoHtml?.classList.remove('ativo');
    botaoPhp?.classList.remove('ativo');
    menuLateral.classList.remove('ativo');
    background.classList.remove('ativo');
}

// Eventos
if (botaoHtml) botaoHtml.addEventListener('click', toggleMenu)
if (botaoPhp) botaoPhp.addEventListener('click', toggleMenu) 
background.addEventListener('click', closeMenu);

