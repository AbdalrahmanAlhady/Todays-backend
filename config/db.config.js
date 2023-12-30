const dbConfig = {
    HOST: "127.0.0.1",
    USER: "root",
    PASSWORD: "123456",
    DB: "today's_db",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  export default dbConfig;