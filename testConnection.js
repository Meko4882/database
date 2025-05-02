// testConnection.js
const { sequelize } = require('./orm');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ 連接成功！已成功連接到資料庫。');
  } catch (error) {
    console.error('❌ 連接失敗：', error);
  } finally {
    await sequelize.close(); // 關閉連線
  }
}

testConnection();
