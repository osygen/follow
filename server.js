process.on("uncaughtException", (error) => {
  console.log(`uncaughtException`);
  // console.log(error.name, error.message, error.stack);
  process.exit(1);
});

require("dotenv").config({ path: "./config.env" });
const app = require("./app");

require("./dataBase").dataBase(process.env.DATABASE_LOCAL);

const port = process.env.PORT;
const server = app.listen(port, () => console.log(`listening on port ${port}`));

process.on("unhandledRejection", (error) => {
  console.log(` unhandledRejection`);
  //   console.log(error.name, error.message, error.stack);
  server.close(() => {
    console.log("shutting down");
    process.exit(1);
  });
});
