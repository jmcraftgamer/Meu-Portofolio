const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const SEEDS = [
  'arroz', 'feijao', 'oleo', 'acucar', 'cafe', 'macarrao',
  'detergente', 'agua_sanitaria', 'sabao_po', 'desinfetante',
  'shampoo', 'sabonete', 'creme_dental', 'papel_higienico',
  'biscoito_recheado', 'salgadinho', 'bolacha_agua_sal', 'biscoito_maizena',
  'patinho_moido', 'peito_frango', 'costela', 'linguica',
  'banner_chocolate', 'banner_carrinho', 'banner_oferta', 'banner_limpeza', 'banner_carnes',
  'carrossel_mercearia', 'carrossel_hortifruti', 'carrossel_acougue',
  'carrossel_bebidas', 'carrossel_higiene', 'carrossel_limpeza',
  'promo_arroz', 'promo_oleo', 'promo_sabonete', 'promo_cafe'
];

const webDir = 'C:/Users/eojap/Projetos/Portofolho/Mercado App/web/public/images';
const serverDir = 'C:/Users/eojap/Projetos/Portofolho/Mercado App/server/public/images';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    const req = protocol.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        if (stats.size === 0) {
          fs.unlinkSync(dest);
          reject(new Error('Empty file'));
        } else {
          resolve(stats.size);
        }
      });
    });

    req.on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(new Error('Timeout'));
    });
  });
}

async function main() {
  console.log('Iniciando download de ' + SEEDS.length + ' imagens...\n');

  let success = 0;
  let fail = 0;

  for (const seed of SEEDS) {
    const filename = seed + '.jpg';
    const dest1 = path.join(webDir, filename);
    const dest2 = path.join(serverDir, filename);
    const url = 'https://picsum.photos/seed/' + seed + '/400/400';

    try {
      console.log('Baixando: ' + filename + '...');
      const size = await download(url, dest1);
      fs.copyFileSync(dest1, dest2);
      console.log('  OK - ' + (size / 1024).toFixed(1) + ' KB');
      success++;
    } catch (err) {
      console.log('  ERRO: ' + err.message);
      fail++;
    }

    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\nConcluido! ' + success + ' OK, ' + fail + ' falhas');
}

main().catch(console.error);
