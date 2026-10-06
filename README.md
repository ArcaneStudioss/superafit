# Supera Fit (protótipo)
Landing da Supera Fitness (Santo Antônio da Patrulha) e página do Supera Pink Night Run. Protótipo da Arcane Studios, `noindex` + `robots.txt` Disallow.

## Estrutura
- `index.html`: landing (celular primeiro). CSS em `css/site.css`, JS em `js/site.js`, acabamento do kit Arcane em `css/arcane-ui.css`, `css/arcane-motion.css`, `js/arcane-ui.js`.
- `pink-night.html`: página do evento.
- `img/`: fotos **ilustrativas** do Unsplash (licença livre), a trocar pelas fotos reais da academia.
- CSS e JS com `?v=AAAAMMDD` (a Discloud guarda cache por 4 h): trocar a versão a cada deploy.

## Para publicar de verdade
Trocar: WhatsApp (`WHATS` em `js/site.js`), preços (`data-m`/`data-t` em `index.html`), horários (`grade` em `js/site.js` e o HTML inicial da lista), depoimentos, pódio do evento e fotos. Tirar as etiquetas "Exemplo", o `noindex` e o Disallow.

Hospedagem: Discloud (`TYPE=site`, ID `superafit`).
