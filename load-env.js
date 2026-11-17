require('dotenv').config();
const fs = require('fs');

if (!process.env.CONTRACT_ADDRESS || !process.env.ADMIN_ADDRESS) {
  console.error("LOI: Thieu bien moi truong CONTRACT_ADDRESS hoac ADMIN_ADDRESS trong tep .env!");
  process.exit(1);
}

const configContent = `window.ENV = {
  CONTRACT_ADDRESS: "${process.env.CONTRACT_ADDRESS.trim()}",
  ADMIN_ADDRESS: "${process.env.ADMIN_ADDRESS.trim()}",
  CHAIN_ID: "${(process.env.CHAIN_ID || '11155111').trim()}"
};`;

fs.writeFileSync('./frontend/config.js', configContent, 'utf8');
console.log("Da nap cau hinh tu bien moi truong (.env) thanh cong!");
