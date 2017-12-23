var express = require('express');
var router = express.Router();
var config = require('../config/config')

var connection = require('../config/db.js')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;

// 检查登录状态中间件
function checkLoginStatus(req, res, next) {
  console.log(req.session)
  if(!req.session.loginStatus) {
    return res.redirect('/login')
  }
  next()
}

module.exports = function(app) {
  var res_data = {}
  app.get('/', function(req, res) {
    connection.query('select * from banners', function(err, results) {
      if(err) throw err
      // console.log(results)
      // res.render('index', {
      //   title: '首页',
      //   banners: results
      // })
      res_data.banners = results
      // console.log(res_data.banners)
    })
    connection.query('select * from article', function(err, results) {
      if(err) throw err
      // console.log(results)
      // res.render('index', {
      //   title: '首页',
      //   article: results
      // })
      res_data.article = results
    })
    res.render('index', {
      title: '首页',
      banners: res_data.banners,
      article: res_data.article
    })
  })
  app.get('/api/v1/article/:page', function(req, res) {// 翻页
    console.log(req.params)
    console.log(req.params.page)
    var init_page=1//默认页码为1
    var num = 3//每页要显示的数据量
    //假如有传递进来的页码，比如2，那么当前的init_page的值则更改为传递进来的值
    if(req.params.page){
     init_page = parseInt(req.params.page)
    }
    var start = 0 //设置起始数据为第一条
    if(init_page > 1){
     start = (init_page - 1) * num //页码减去1，乘以条数就得到分页的起始数了
    }
    var sql = 'select * from article limit ' + start + ',' + num // 注意limit后加入空格
    connection.query(sql, function(err, results) {
      if(err) throw err
      res.json({
        msg: results
      })
    })
    // res.json({
    //   msg: 'ok'
    // })
  })
  // 后台
  app.get('/login', function(req, res) {
    res.render('dashboard/login', {
      title: '登录后台'
    })
  })
  app.post('/login', function(req, res) {
    // 管理后台只需要一个管理员账号，不连接数据库
    var username = req.body.username
    var password = req.body.password
    if(username === config.administrator && password === config.password) {
      req.session.loginStatus = true
      res.redirect('/dashboard')
    }
  })
  app.get('/dashboard', checkLoginStatus, function(req, res) {
    res.render('dashboard/dashboard', {
      title: '控制台'
    })
  })
  app.get('/dashboard/banner', checkLoginStatus, function(req, res) {
    connection.query('select * from banners', function(err, results) {
      if(err) throw err
      // console.log(results)
      res.render('dashboard/banner', {
        title: 'banner',
        banners: results
      })
    })
  })
  app.post('/dashboard/banner', function(req, res) {
    // console.log(req.body)
    // console.log(req.files)
    // console.log(req.files[0].path)
    var sql = 'insert into banners (image_url, text) values (?, ?)'
    connection.query(sql, ['/uploads/' + req.files[0].filename, req.body.desc], function(err, results) {
      if(err) throw err
      console.log(results)
      res.json({
        ok: true,
        msg: '上传图片成功'
      })
    })
  })
  app.get('/dashboard/article', checkLoginStatus, function(req, res) {
    connection.query('select * from article', function(err, results) {
      if(err) throw err
      res.render('dashboard/article', {
        title: '文章',
        articles: results
      })
    })
  })
  app.get('/dashboard/article/new', checkLoginStatus, function(req, res) {
    res.render('dashboard/new_article', {
      title: '添加文章'
    })
  })
  app.post('/dashboard/article/new', function(req, res) {
    // console.log(req.body)
    // console.log(req.body.title)
    // console.log(req.body.content)
    var sql = 'insert into article (title, content) values (?, ?)'
    connection.query(sql, [req.body.title, req.body.content], function(err, results) {
      if(err) throw err
      res.json({
        ok: true,
        msg: '文章保存成功'
      })
    })
  })
  // app.post('/upload/editorImage', function(req, res) {
  //   if(err) throw err
  //   res.json({
  //     success: true/false,
  //     msg: "error message",
  //     file_path: '/uploads/' + req.files[0].filename
  //   })
  // })
}
