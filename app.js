let db = require('./config/mysql').connection;
var bodyParser = require('body-parser');
var cors = require('cors');
var app = require('express')();
db.connect();    
app.use(cors());
app.use( bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.get('/lists', function(req, res) {
    db.query(`select lists.*, GROUP_CONCAT(tags.description, ',') tags from lists 
        left join lists_has_tags lht on lists.id = lht.lists_id 
        left join tags on tags.id = lht.tags_id
        group by lists.id`, function(err, rows, fields) {
        if (err) throw err;
        for(let i = 0, lim = rows.length; i < lim; i++){
            if(rows[i].tags){
                rows[i].tags = rows[i].tags.split(',').filter(tag => tag != "");
            }
        }
        res.send(JSON.stringify(rows));
    });
});
 
app.get('/lists/:id', function(req, res) {
    var id = parseInt(req.params.id, 10);
    db.query(`select lists.*, GROUP_CONCAT(tags.description, ',') tags from lists 
        left join lists_has_tags lht on lists.id = lht.lists_id 
        left join tags on tags.id = lht.tags_id
        where lists.id = ${id} group by lists.id`, function(err, rows, fields) {
        if (err) throw err;
        for(let i = 0, lim = rows.length; i < lim; i++){
            if(rows[i].tags){
                rows[i].tags = rows[i].tags.split(',').filter(tag => tag != "");
            }
        }
        if (!rows.length) {
            return res.sendStatus(404);
        } 
        res.send(JSON.stringify(rows));
    });
});
app.post('/lists', function(req, res) {

    var query = req.body.id == null ? `INSERT INTO lists SET ?`: `UPDATE lists SET ? WHERE id = ${req.body.id}`,
    post = {name: req.body.name, is_shared: req.body.is_shared, value_max: 0, value_min: 0};
    db.query(query, post, function(err) {
        if (err) throw err;
        res.type('json');
        res.send(JSON.stringify({status: "OK"}));
    });

});
 
var server = app.listen(3001, function () {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;
 
  console.log('listening at http://%s:%s', host, port);
});