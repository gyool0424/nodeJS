const express = require("express"); //express 모듈을 가져옴
const app = express(); //function을 이용해서 express app만들었음
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://kyuri:qwer1234!@boilerplate.qnxqd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected...."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
// 루트 디렉에서 hello world하는거

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
