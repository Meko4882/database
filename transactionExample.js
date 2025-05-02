const pool = require('./db');

async function doTransaction() {
  const studentId = 'S10811001';
  let conn;

  try {
    conn = await pool.getConnection();

    // 檢查學生是否存在
    const rows = await conn.query('SELECT * FROM STUDENT WHERE Student_ID = ?', [studentId]);
    if (rows.length === 0) {
      console.log(`學生學號 ${studentId} 不存在，程式終止。`);
      return;
    }

    await conn.beginTransaction();

    // 更新學生的系所
    const updateStudent = 'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?';
    await conn.query(updateStudent, ['EE001', studentId]);

    await conn.commit();
    console.log('交易成功，已提交');

    // 查詢並顯示目前的系所名稱
const deptRows = await conn.query(`
    SELECT D.Name
    FROM STUDENT S
    JOIN DEPARTMENT D ON S.Department_ID = D.Department_ID
    WHERE S.Student_ID = ?
  `, [studentId]);
  
  if (deptRows.length > 0) {
    console.log(`目前系所：${deptRows[0].Name}`);
  }
  

  } catch (err) {
    if (conn) await conn.rollback();
    console.error('交易失敗，已回滾：', err);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction();
