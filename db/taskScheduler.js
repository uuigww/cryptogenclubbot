const Database = require('better-sqlite3');
const cron = require('node-cron');

class TaskScheduler {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.initDatabase();
  }

  // Инициализация базы данных
  initDatabase() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS scheduled_tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tgid INTEGER NOT NULL,
          message TEXT NOT NULL,
          execute_at DATETIME NOT NULL
      );
    `);
  }

  // Добавление задачи
  addTask(tgid, message, delayInMinutes) {
    const executeAt = new Date();
    executeAt.setMinutes(executeAt.getMinutes() + delayInMinutes);
    const stmt = this.db.prepare(`
      INSERT INTO scheduled_tasks (tgid, message, execute_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(tgid, message, executeAt.toISOString());
  }

  // Удаление всех задач пользователя по tgid
  deleteTasksByTgid(tgid) {
    const stmt = this.db.prepare(`DELETE FROM scheduled_tasks WHERE tgid = ?`);
    const changes = stmt.run(tgid).changes;
    console.log(`Удалено ${changes} задач для пользователя ${tgid}`);
    return changes;
  }

  // Обработка задач
  async processTasks(sendMessageCallback) {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      SELECT * FROM scheduled_tasks WHERE execute_at <= ?
    `);
    const tasks = stmt.all(now);

    tasks.forEach(async (task) => {
      try {
        await sendMessageCallback(task.tgid, task.message);
        console.log(`Сообщение отправлено пользователю ${task.tgid}`);
        // Удаление выполненной задачи
        const deleteStmt = this.db.prepare(`DELETE FROM scheduled_tasks WHERE id = ?`);
        deleteStmt.run(task.id);
      } catch (error) {
        console.error(`Ошибка отправки сообщения: ${error.message}`);
      }
    });
  }

  // Запуск cron-job
  startCron(sendMessageCallback) {
    cron.schedule('* * * * *', () => {
      console.log('Проверка задач...');
      this.processTasks(sendMessageCallback);
    });
  }
}

module.exports = TaskScheduler;
