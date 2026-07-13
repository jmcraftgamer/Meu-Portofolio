const fs = require('fs');
const path = require('path');

const items = [
  { file: 'arroz.svg', label: 'Arroz', bg: '#FFF3E0', fg: '#E65100' },
  { file: 'feijao.svg', label: 'Feijao', bg: '#4E342E', fg: '#D7CCC8' },
  { file: 'oleo.svg', label: 'Oleo', bg: '#FFF8E1', fg: '#F57F17' },
  { file: 'acucar.svg', label: 'Acucar', bg: '#F3E5F5', fg: '#7B1FA2' },
  { file: 'cafe.svg', label: 'Cafe', bg: '#3E2723', fg: '#D7CCC8' },
  { file: 'macarrao.svg', label: 'Macarrao', bg: '#FFFDE7', fg: '#F9A825' },
  { file: 'detergente.svg', label: 'Detergente', bg: '#E3F2FD', fg: '#1565C0' },
  { file: 'agua_sanitaria.svg', label: 'Agua Sanit.', bg: '#E0F7FA', fg: '#00838F' },
  { file: 'sabao_po.svg', label: 'Sabao em Po', bg: '#FCE4EC', fg: '#C62828' },
  { file: 'desinfetante.svg', label: 'Desinfetante', bg: '#F1F8E9', fg: '#558B2F' },
  { file: 'shampoo.svg', label: 'Shampoo', bg: '#E8EAF6', fg: '#283593' },
  { file: 'sabonete.svg', label: 'Sabonete', bg: '#FFF3E0', fg: '#E65100' },
  { file: 'creme_dental.svg', label: 'Creme Dental', bg: '#E0F2F1', fg: '#00695C' },
  { file: 'papel_higienico.svg', label: 'Papel Higienico', bg: '#FAFAFA', fg: '#616161' },
  { file: 'biscoito_recheado.svg', label: 'Biscoito Rech.', bg: '#FFF8E1', fg: '#F57F17' },
  { file: 'salgadinho.svg', label: 'Salgadinho', bg: '#FFF3E0', fg: '#D84315' },
  { file: 'bolacha_agua_sal.svg', label: 'Bolacha A/S', bg: '#ECEFF1', fg: '#455A64' },
  { file: 'biscoito_maizena.svg', label: 'Biscoito Maiz.', bg: '#FFFDE7', fg: '#F9A825' },
  { file: 'patinho_moido.svg', label: 'Patinho Moido', bg: '#EFEBE9', fg: '#4E342E' },
  { file: 'peito_frango.svg', label: 'Peito Frango', bg: '#FBE9E7', fg: '#BF360C' },
  { file: 'costela.svg', label: 'Costela', bg: '#D7CCC8', fg: '#3E2723' },
  { file: 'linguica.svg', label: 'Linguica', bg: '#FFCCBC', fg: '#BF360C' },
  { file: 'banner_chocolate.svg', label: 'Chocolate', bg: '#3E2723', fg: '#D7CCC8' },
  { file: 'banner_carrinho.svg', label: 'Carrinho', bg: '#C62828', fg: '#FFFFFF' },
  { file: 'banner_oferta.svg', label: 'Ofertas', bg: '#E53935', fg: '#FFFFFF' },
  { file: 'banner_limpeza.svg', label: 'Limpeza', bg: '#1565C0', fg: '#FFFFFF' },
  { file: 'banner_carnes.svg', label: 'Carnes', bg: '#4E342E', fg: '#FFFFFF' },
  { file: 'carrossel_mercearia.svg', label: 'Mercearia', bg: '#F57F17', fg: '#FFFFFF' },
  { file: 'carrossel_hortifruti.svg', label: 'Hortifruti', bg: '#2E7D32', fg: '#FFFFFF' },
  { file: 'carrossel_acougue.svg', label: 'Acougue', bg: '#BF360C', fg: '#FFFFFF' },
  { file: 'carrossel_bebidas.svg', label: 'Bebidas', bg: '#1565C0', fg: '#FFFFFF' },
  { file: 'carrossel_higiene.svg', label: 'Higiene', bg: '#6A1B9A', fg: '#FFFFFF' },
  { file: 'carrossel_limpeza.svg', label: 'Limpeza', bg: '#00838F', fg: '#FFFFFF' },
  { file: 'promo_arroz.svg', label: 'Arroz Promo', bg: '#FFF3E0', fg: '#E65100' },
  { file: 'promo_oleo.svg', label: 'Oleo Promo', bg: '#FFF8E1', fg: '#F57F17' },
  { file: 'promo_sabonete.svg', label: 'Sabonete Promo', bg: '#FFF3E0', fg: '#E65100' },
  { file: 'promo_cafe.svg', label: 'Cafe Promo', bg: '#3E2723', fg: '#D7CCC8' },
];

function makeSvg(label, bg, fg) {
  const icon = label.replace(/[^A-Za-z0-9]/g, '').substring(0, 2).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bg}"/>
    <rect x="40" y="40" width="320" height="320" rx="20" fill="${fg}" opacity="0.12"/>
    <text x="200" y="180" text-anchor="middle" fill="${fg}" font-size="80" font-weight="bold" font-family="sans-serif" opacity="0.8">${icon}</text>
    <text x="200" y="260" text-anchor="middle" fill="${fg}" font-size="22" font-family="sans-serif" opacity="0.6">${label}</text>
    <rect x="100" y="300" width="200" height="6" rx="3" fill="${fg}" opacity="0.15"/>
  </svg>`;
}

const webDir = 'C:/Users/eojap/Projetos/Portofolho/Mercado App/web/public/images';
const serverDir = 'C:/Users/eojap/Projetos/Portofolho/Mercado App/server/public/images';

for (const item of items) {
  const svg = makeSvg(item.label, item.bg, item.fg);
  fs.writeFileSync(path.join(webDir, item.file), svg);
  fs.writeFileSync(path.join(serverDir, item.file), svg);
  console.log('OK: ' + item.file);
}
console.log('Total: ' + items.length + ' SVGs gerados');
