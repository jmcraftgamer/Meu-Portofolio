const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function fix() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, 'data', 'central.db');
  const buf = fs.readFileSync(dbPath);
  const db = new SQL.Database(buf);

  const stmt = db.prepare("UPDATE products SET image = REPLACE(image, '.jpg', '.svg')");
  stmt.step();
  stmt.free();
  console.log('Registros atualizados:', db.getRowsModified());

  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
  console.log('Banco atualizado com sucesso!');
}

fix().catch(console.error);
