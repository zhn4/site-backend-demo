var connection = require('./db.js')

// connection.query('select * from banners', function(err, results) {
//   if(err) throw err
//   console.log(results[0])
// })
connection.query('insert into banners (image_url, text) values (?, ?)', ['./public/uploads/logo.png', 'logo image'], function(err, results) {
  if(err) throw err
  console.log(results[0])
})
