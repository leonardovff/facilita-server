let db = require('./config/mysql').connection;
var cors = require('cors');
var app = require('express')();
db.connect();    
app.use(cors());
app.get('/lists', function(req, res) {
    db.query(`select lists.*, GROUP_CONCAT(tags.description, ',') tags from lists 
        left join lists_has_tags lht on lists.id = lht.lists_id 
        left join tags on tags.id = lht.tags_id
        group by lists.id`, function(err, rows, fields) {
        if (err) throw err;
        for(let i = 0, lim = rows.length; i < lim; i++){
            rows[i].tags = rows[i].tags.split(',').filter(tag => tag != "");
        }
        res.send(JSON.stringify(rows));
    });
});
 
app.get('/lists/:id', function(req, res) {
    // var id = parseInt(req.params.id, 10);
    // var result = resources.filter(r => r.id === id)[0];
 
    // if (!result) {
    //     res.sendStatus(404);
    // } else {
    //     res.send(result);
    // }
});
 
var server = app.listen(3001, function () {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;
 
  console.log('listening at http://%s:%s', host, port);
});