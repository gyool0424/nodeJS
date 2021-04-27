const express = require("express"); //express 모듈을 가져옴
const app = express(); //function을 이용해서 express app만들었음
const port = 5000;
const bodyParser = require("body-parser");
const { User } = require("./models/User");

const config = require("./config/key");
// client에서 오는 정보들을 서버에서 분석해서 가져올수 있게 해주는거
//application/x-ww-form-urlencoded 이렇게 생긴걸 가져올 수 있음
app.use(bodyParser.urlencoded({ extended: true }));
//aplication/json 타입을 가져올 수 있음
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected...."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!!!!안녕");
});
// 루트 디렉에서 hello world하는거

app.post("/register", (req, res) => {
  // 회원가입시 필요한 정보들을 client에서 가져오면
  // 그것들을 db에 넣어준다

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
