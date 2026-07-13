const fs = require('fs');
const zlib = require('zlib');

function extractDominantRed(filePath) {
  const buf = fs.readFileSync(filePath);
  
  let offset = 8;
  
  function readChunk() {
    if (offset + 8 > buf.length) return null;
    const length = buf.readUInt32BE(offset);
    const type = buf.toString('ascii', offset + 4, offset + 8);
    const data = buf.slice(offset + 8, offset + 8 + length);
    offset += 12 + length;
    return { type, data, length };
  }

  let width, height, colorType, bitDepth;
  const idatChunks = [];

  while (offset < buf.length) {
    const chunk = readChunk();
    if (!chunk) break;
    
    if (chunk.type === 'IHDR') {
      width = chunk.data.readUInt32BE(0);
      height = chunk.data.readUInt32BE(4);
      bitDepth = chunk.data[8];
      colorType = chunk.data[9];
    } else if (chunk.type === 'IDAT') {
      idatChunks.push(chunk.data);
    } else if (chunk.type === 'IEND') {
      break;
    }
  }

  if (!width || !height || idatChunks.length === 0) {
    console.log('#e53935');
    return;
  }

  const compressed = Buffer.concat(idatChunks);
  const raw = zlib.inflateSync(compressed);
  
  const bytesPerPixel = colorType === 6 ? 4 : 3; // RGBA or RGB
  const stride = width * bytesPerPixel + 1; // +1 for filter byte per row
  
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  const step = 5;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = y * stride + x * bytesPerPixel + 1; // +1 for filter byte
      if (idx + 2 >= raw.length) continue;
      const r = raw[idx];
      const g = raw[idx + 1];
      const b = raw[idx + 2];
      if (r > b && r > g && r > 100) {
        rSum += r; gSum += g; bSum += b; count++;
      }
    }
  }

  if (count > 0) {
    const r = Math.min(255, Math.round(rSum / count));
    const g = Math.min(255, Math.round(gSum / count));
    const b = Math.min(255, Math.round(bSum / count));
    const hex = '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
    console.log(hex);
  } else {
    console.log('#e53935');
  }
}

extractDominantRed('C:/Users/eojap/Projetos/Portofolho/Mercado App/web/public/images/banner_personalizado.png');
