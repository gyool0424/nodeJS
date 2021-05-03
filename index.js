const express = require("express"); //express 모듈을 가져옴
const app = express(); //function을 이용해서 express app만들었음
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

const config = require("./config/key");
// client에서 오는 정보들을 서버에서 분석해서 가져올수 있게 해주는거
//application/x-ww-form-urlencoded 이렇게 생긴걸 가져올 수 있음
app.use(bodyParser.urlencoded({ extended: true }));
//aplication/json 타입을 가져올 수 있음
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require("mongoose");
const { json } = require("body-parser");
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
  res.send("Hello World!!!!꾸꾸");
});
// 루트 디렉에서 hello world하는거

app.post("/api/users/register", (req, res) => {
  // 회원가입시 필요한 정보들을 client에서 가져오면
  // 그것들을 db에 넣어준다

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 db에 있는지 찾는다
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 요청된 이메일이 db에 있다면, 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });
    });
    // 비밀번호까지 같다면 토큰을 생성하기
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);

      // 토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지, 등등
      // 각 저장 방법은 장단이 존재하는데 이번에는 쿠키에 저장하기로함
      res
        .cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id });
    });
  });
});

app.get("/api/users/auth", auth, (req, res) => {
  // auth는 미들웨어인데 auth라는 엔드포인트에서 리퀘스트 받은 후 콜백하기 전에 중간에서 뭔가 실행해줌
  // 여기까지 미들웨어를 통과해서 왔다는것은 authentication이 true라는 것
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.josn({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
