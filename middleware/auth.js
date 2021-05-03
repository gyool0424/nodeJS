const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증 처리를 하는 곳

  // 클라이언트 쿠키에서 토큰을 가지고 온다
  let token = req.cookies.x_auth;

  // 토큰을 복호화 한 뒤에 유저를 찾는다
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token; //넣어주는 이유: 토큰, 유저를 리퀘스트에 넣어줘서 나중에 index.js app.get안에서 req값 사용가능
    req.user = user;
    next(); // 이걸 안해주면 middleware에서 갇혀버림
  });

  // 유저가 있으면 인증 ok

  // 유저가 없으면 인증 no
};

module.exports = { auth };
