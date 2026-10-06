/* Supera Fitness · comportamento da página (sem dependências, sem listener de scroll) */
(() => {
  'use strict';
  const d = document;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WHATS = ''; // TROCAR: WhatsApp da Supera só com números, ex.: 5551999999999
  const ano = d.querySelector('[data-ano]'); if (ano) ano.textContent = new Date().getFullYear();

  // botão fixo do celular: aparece depois do herói e some na chamada final
  const flut = d.getElementById('flutuante');
  let passouHeroi = false, naFinal = false;
  const atualizaFlut = () => flut.classList.toggle('on', passouHeroi && !naFinal);
  new IntersectionObserver(([e]) => { passouHeroi = !e.isIntersecting; atualizaFlut(); }, { rootMargin: '-120px 0px 0px 0px' }).observe(d.querySelector('.heroi'));
  const fim = new Set();
  const fo = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? fim.add(e.target) : fim.delete(e.target)); naFinal = fim.size > 0; atualizaFlut(); });
  fo.observe(d.querySelector('.final')); fo.observe(d.querySelector('footer'));

  // manifesto: as palavras acendem conforme a leitura
  const man = d.querySelector('[data-manifesto]'), dest = ['ninguém', 'sozinho.', 'plano,', 'nome', 'torcendo'];
  man.setAttribute('aria-label', man.textContent.trim());
  man.innerHTML = man.textContent.trim().split(/\s+/).map(w => `<span class="pal${dest.includes(w) ? ' v' : ''}" aria-hidden="true">${w}</span>`).join(' ');
  const po = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('on', e.isIntersecting || e.boundingClientRect.top < 0)), { rootMargin: '0px 0px -40% 0px' });
  man.querySelectorAll('.pal').forEach(p => po.observe(p));

  // linha do tempo do método: cada passo acende ao chegar no meio da tela
  const linha = d.querySelector('[data-linha]'), passos = [...linha.children];
  const marca = () => { const n = passos.filter(p => p.classList.contains('on')).length; linha.style.setProperty('--prog', passos.length > 1 ? Math.max(0, n - 1) / (passos.length - 1) : 1); };
  const lo = new IntersectionObserver(es => { es.forEach(e => e.target.classList.toggle('on', e.isIntersecting || e.boundingClientRect.top < 0)); marca(); }, { rootMargin: '0px 0px -45% 0px' });
  passos.forEach(p => lo.observe(p));

  // horários por dia (exemplo, trocar pela grade real)
  const grade = {
    semana: [['06h', 'Musculação e personalizado', 'professor na sala'], ['12h', 'Musculação e personalizado', 'horário do almoço'], ['18h', 'Musculação e personalizado', 'horário mais cheio'], ['21h', 'Fechamento', '']],
    ter: [['07h', 'Mobilidade e recovery', 'com fisioterapeuta'], ['19h', 'Treino coletivo de corrida', 'saída da academia']],
    sab: [['08h', 'Musculação', 'horário livre com professor'], ['09h', 'Corrida em grupo', 'longão de sábado'], ['12h', 'Fechamento', '']]
  };
  const lista = d.getElementById('grade'), abas = d.getElementById('abas');
  const mostraDia = k => { lista.innerHTML = grade[k].map(([h, t, s]) => `<li><time>${h}</time><span>${t}${s ? `<small>${s}</small>` : ''}</span></li>`).join('');
    abas.querySelectorAll('button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.dia === k))); };
  abas.addEventListener('click', e => { const b = e.target.closest('button'); if (b) mostraDia(b.dataset.dia); });
  abas.addEventListener('keydown', e => { if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return; const bs = [...abas.children], i = bs.findIndex(b => b.getAttribute('aria-selected') === 'true');
    const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length]; n.focus(); mostraDia(n.dataset.dia); });
  mostraDia('semana');

  // depoimentos: pontinhos acompanham o cartão visível
  const depo = d.getElementById('depo'), pontos = d.getElementById('pontos'), cards = [...depo.children];
  cards.forEach((c, i) => { const b = d.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', `Depoimento ${i + 1}`);
    b.addEventListener('click', () => depo.scrollTo({ left: c.offsetLeft - depo.offsetLeft, behavior: reduz ? 'auto' : 'smooth' })); pontos.append(b); });
  const dio = new IntersectionObserver(es => es.forEach(e => { const p = pontos.children[cards.indexOf(e.target)];
    e.isIntersecting ? p.setAttribute('aria-current', 'true') : p.removeAttribute('aria-current'); }), { root: depo, threshold: .6 });
  cards.forEach(c => dio.observe(c));

  // planos mensal / trimestral
  const alt = d.getElementById('alterna');
  alt.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const t = b.dataset.per === 't';
    alt.classList.toggle('tri', t); alt.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    d.querySelectorAll('.preco b').forEach(v => v.textContent = t ? v.dataset.t : v.dataset.m); });

  // mapa só carrega quando a pessoa pede (página mais leve e sem rastreio do Google de cara)
  d.getElementById('carrega-mapa').addEventListener('click', () => {
    const f = d.createElement('iframe'); f.title = 'Mapa da Supera Fitness'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = 'https://www.google.com/maps?q=Av.+Coronel+Victor+Villa+Verde,+36,+Santo+Ant%C3%B4nio+da+Patrulha+RS&output=embed';
    d.getElementById('mapa').replaceChildren(f);
  });

  // janela da aula grátis em 3 passos
  const modal = d.getElementById('modal'), erro = d.getElementById('erro'), av = d.getElementById('avancar'), vo = d.getElementById('voltar'), nome = d.getElementById('nome');
  let passo = 1, plano = '', antes = null;
  const sel = g => d.querySelector(`[data-grupo="${g}"] [aria-pressed="true"]`)?.childNodes[0].textContent.trim();
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const mostra = () => {
    d.querySelectorAll('.etapa').forEach(e => e.hidden = +e.dataset.etapa !== passo);
    d.querySelectorAll('.etapas i').forEach((b, i) => b.classList.toggle('on', i < passo));
    vo.hidden = passo === 1; av.textContent = passo === 3 ? 'Enviar pelo WhatsApp' : 'Continuar'; erro.textContent = '';
    if (passo === 3) { d.getElementById('resumo').innerHTML = `Objetivo: <b>${esc(sel('objetivo'))}</b><br>Período: <b>${esc(sel('periodo'))}</b>${plano ? `<br>Plano: <b>${esc(plano)}</b>` : ''}`; setTimeout(() => nome.focus(), 60); }
  };
  const abrir = b => { plano = b.dataset.plano || ''; antes = b; passo = 1; mostra(); modal.hidden = false; requestAnimationFrame(() => modal.classList.add('on')); d.documentElement.classList.add('ui-lock'); d.body.style.overflow = 'hidden'; };
  const fechar = () => { modal.classList.remove('on'); d.documentElement.classList.remove('ui-lock'); d.body.style.overflow = ''; setTimeout(() => { modal.hidden = true; antes?.focus(); }, 360); };
  d.querySelectorAll('[data-abrir]').forEach(b => b.addEventListener('click', () => abrir(b)));
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('[data-fechar]')) fechar(); });
  d.addEventListener('keydown', e => {
    if (modal.hidden) return;
    if (e.key === 'Escape') fechar();
    if (e.key === 'Tab') { const f = [...modal.querySelectorAll('button:not([hidden]),input')].filter(x => x.offsetParent); const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && d.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && d.activeElement === z) { e.preventDefault(); a.focus(); } }
  });
  d.querySelectorAll('[data-grupo]').forEach(g => g.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
    g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); setTimeout(() => { if (passo < 3) { passo++; mostra(); } }, reduz ? 0 : 240); }));
  vo.addEventListener('click', () => { passo--; mostra(); });
  nome.addEventListener('keydown', e => { if (e.key === 'Enter') av.click(); });
  av.addEventListener('click', () => {
    if (passo === 1 && !sel('objetivo')) return erro.textContent = 'Escolha um objetivo.';
    if (passo === 2 && !sel('periodo')) return erro.textContent = 'Escolha um período.';
    if (passo < 3) { passo++; return mostra(); }
    const n = nome.value.trim();
    if (n.length < 2) { erro.textContent = 'Conta pra gente o seu nome.'; return nome.focus(); }
    const txt = `Olá! Sou ${n} e quero agendar uma aula grátis na Supera.\nObjetivo: ${sel('objetivo')}\nPeríodo: ${sel('periodo')}${plano ? `\nPlano de interesse: ${plano}` : ''}`;
    if (!WHATS) { window.Arcane?.toast('Protótipo: no site oficial isto abre o WhatsApp da Supera com a mensagem pronta.', { tipo: 'info', ms: 5200 }); return fechar(); }
    window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener'); fechar();
  });
})();
