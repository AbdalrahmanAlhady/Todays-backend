const dbConfig = {
    HOST: "sql11.freemysqlhosting.net",
    USER: "sql11653766",
    PASSWORD: "FBwfCQPyvs",
    DB: "sql11653766",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  export default dbConfig;