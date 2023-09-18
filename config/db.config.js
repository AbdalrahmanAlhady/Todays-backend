const dbConfig = {
    HOST: "containers-us-west-140.railway.app",
    USER: "root",
    PASSWORD: "K0fcotH1rx3AXktxjp19",
    DB: "railway",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  export default dbConfig;