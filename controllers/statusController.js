exports.getAllStatus = (req, res, next) => {
  res.status(200).json({ success: true, data: "get all status" });

  next();
};

exports.getOneStatus = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, data: `get one status ${req.params.id}` });
};

exports.createStatus = (req, res, next) => {
  //   if (!req.body.username) return res.status(400).send("pls provide username");
  res.status(200).json({ success: true, data: req.body });

  next();
};

exports.editStatus = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, data: `edit one status ${req.params.id}` });
};

exports.deleteStatus = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, data: `delete one status ${req.params.id}` });
};
// console.log(exports);
