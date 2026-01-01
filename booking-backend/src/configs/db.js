const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Thử kết nối ngay khi file này được load
prisma.$connect()
  .then(() => {
    console.log("✅ Kết nối Database thành công!");
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối Database:", err);
    process.exit(1); // Thoát và báo lỗi rõ ràng
  });

module.exports = prisma;
