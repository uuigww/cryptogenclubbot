const Database = require("better-sqlite3");
const db = new Database("users.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    tgid INTEGER PRIMARY KEY CHECK(tgid > 0),
    username TEXT CHECK(LENGTH(username) <= 64),
    utm TEXT DEFAULT 'default' CHECK(LENGTH(utm) <= 16),
    activity INTEGER CHECK(activity > 0),
    subscription_end DATETIME
  );
`);

const UserDB = {
  // Добавить нового пользователя
  addUser: (tgid, username, utm = "default", activity = 1) => {
    // Проверяем, существует ли пользователь с данным tgid
    const checkStmt = db.prepare(`
        SELECT COUNT(*) AS count FROM users WHERE tgid = ?
    `);
    const exists = checkStmt.get(tgid).count > 0;

    if (!exists) {
      const insertStmt = db.prepare(`
            INSERT INTO users (tgid, username, utm, activity)
            VALUES (?, ?, ?, ?)
        `);
      const changes = insertStmt.run(tgid, username, utm, activity).changes;
      return changes > 0;
    } else {
      return false;
    }
  },

  // Обновить поле подписки при оплате
  updateSubscription: (tgid, subscriptionDuration) => {
    const user = UserDB.getUser(tgid);
    if (!user) return false; // Пользователь не найден

    const newSubscriptionEnd = new Date();
    newSubscriptionEnd.setDate(
      newSubscriptionEnd.getDate() + subscriptionDuration
    );

    const stmt = db.prepare(`
      UPDATE users 
      SET subscription_end = ? 
      WHERE tgid = ?
    `);
    stmt.run(newSubscriptionEnd.toISOString(), tgid);
    return true;
  },

  // Обновить username
  updateUsername: (tgid, newUsername) => {
    const stmt = db.prepare(
      `UPDATE users SET username = ? WHERE tgid = ? AND username != ?`
    );
    const changes = stmt.run(newUsername, tgid, newUsername).changes;
    return changes > 0;
  },

  updateActivity: (tgid, newActivity) => {
    console.log(tgid, newActivity)
    const stmt = db.prepare(
      `UPDATE users SET activity = ? WHERE tgid = ? AND activity < ?`
    );
    const changes = stmt.run(newActivity, tgid, newActivity).changes;
    return changes > 0;
  },

  // Получить пользователя по tgid
  getUser: (tgid) => {
    const stmt = db.prepare(`SELECT * FROM users WHERE tgid = ?`);
    return stmt.get(tgid);
  },

  // Получить пользователей по метке utm или активности
  getUsersByFilter: (filter) => {
    const { utm, activity } = filter;
    let query = `SELECT * FROM users WHERE 1=1`;
    const params = [];
    if (utm) {
      query += ` AND utm = ?`;
      params.push(utm);
    }
    if (activity) {
      query += ` AND activity = ?`;
      params.push(activity);
    }
    const stmt = db.prepare(query);
    return stmt.all(...params);
  },

  // Проверить подписки и отправить уведомления
  checkSubscriptions: (sendNotification, removeUser) => {
    const now = new Date();
    const stmt = db.prepare(`
      SELECT * FROM users WHERE subscription_end IS NOT NULL
    `);
    const users = stmt.all();
    users.forEach((user) => {
      const end = new Date(user.subscription_end);
      const diffMs = end - now;
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (
        diffDays === 3 ||
        diffDays === 2 ||
        diffDays === 1 ||
        diffMs <= 7200000
      ) {
        sendNotification(user, diffDays);
      }
      if (diffMs <= 0) {
        removeUser(user);
        const deleteStmt = db.prepare(`DELETE FROM users WHERE tgid = ?`);
        deleteStmt.run(user.tgid);
      }
    });
  },
};

module.exports = UserDB;
