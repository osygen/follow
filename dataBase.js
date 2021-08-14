const { connect } = require("mongoose");
// const chalk = require("chalk");

exports.dataBase = async (dbURI) => {
  const conn = await connect(dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
  console.log(conn.connection.host);
};
