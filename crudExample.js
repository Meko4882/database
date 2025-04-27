// crudExample.js
const pool = require('./db');

async function basicCrud() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // 1. INSERT 新增
    let sql = 'INSERT INTO STUDENT (Student_ID, Name, Gender, Email, Department_ID) VALUES (?, ?, ?, ?, ?)';
    await conn.query(sql, ['S10810001', '王曉明', 'M', 'wang@example.com', 'CS001']);
    console.log('已新增一筆學生資料');
    
    // 2. SELECT 查詢
    sql = 'SELECT * FROM STUDENT WHERE Department_ID = ?';
    const rows = await conn.query(sql, ['CS001']);
    console.log('查詢結果：', rows);

    // 準備更新與刪除的學號
    const targetStudentId = 'S10810001';

    // 先查詢是否存在該學號
    sql = 'SELECT * FROM STUDENT WHERE Student_ID = ?';
    const student = await conn.query(sql, [targetStudentId]);

    if (student.length > 0) {
      // 3. UPDATE 更新
      sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
      await conn.query(sql, ['王小明', targetStudentId]);
      console.log('已更新學生名稱');

      // 4. DELETE 刪除
      sql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
      await conn.query(sql, [targetStudentId]);
      console.log('已刪除該學生');
    } else {
      console.log(`查無此學號：${targetStudentId}，不執行更新與刪除`);
    }

  } catch (err) {
    console.error('操作失敗：', err);
  } finally {
    if (conn) conn.release();
  }
}

basicCrud();
