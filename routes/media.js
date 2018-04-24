const express = require('express');
const router = express.Router();
const cassandra = require('cassandra-driver');
//multer is used for uploading files.
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const mime = require('mime-types') //content-type utility
const client = new cassandra.Client({ contactPoints: ['192.168.1.41:9042', '192.168.1.42:9042', '192.168.1.44:9042'], keyspace: 'media' });//connect to the cluster

var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211', { retries: 10 });

//addmedia endpoint
router.post('/addmedia', upload.single('content'), function (req, res) {

    // check if logged in
    if (typeof (req.cookies.username) == 'undefined') {
        res.status(200).json({
            status: 'error',
            error: 'No current user'
        });
        return;
    }

    var id = (new Date).getTime().toString(); //create unique id for each item in cassandra
    var content = req.file.buffer;

    const query = 'INSERT INTO media (id, content) VALUES (?, ?)';

    const params = [id, content];
    client.execute(query, params, { prepare: true }, function (err) {
        if (err) {
            console.log(err);
            res.status(200).json({
                status: 'error',
                error: 'failed to save media in cassandra'
            });
        }
        else {
            console.log('Inserted media(id: ' + params[0] + ') in the cluster');
            res.status(200).json({
                status: 'OK',
                id: id
            });
        }
    });
});

router.get('/media/:id', (req, res, next) => {

    var id = req.params.id;
    console.log("Finding media: " + id);

    var mimetype = mime.lookup(id);
    res.set('Content-Type', mimetype);

    const query = 'SELECT content FROM media WHERE id = ?';

    const params = [id];
    client.execute(query, params, { prepare: true }, function (err, result) {
        if (err) {
            console.log('**ERROR** in client.execute');
            console.log(err);
        }
        else {
            console.log('Get image success!');
            res.end(new Buffer(result.rows[0].content), 'binary');
            /*
               res.send() insists on sticking charset into the content-type
               res.end() can send data back with a 'binary' encoding
           */
        }
    });
});

router.get('/media/:id', (req, res, next) => {

    var id = req.params.id;
    console.log("Finding media: " + id);

    var mimetype = mime.lookup(id);
    res.set('Content-Type', mimetype);

    const query = 'SELECT content FROM media WHERE id = ?';

    const params = [id];
    client.execute(query, params, { prepare: true }, function (err, result) {
        if (err) {
            console.log('**ERROR** in client.execute');
            console.log(err);
        }
        else {
            console.log('Get image success!');
            res.end(new Buffer(result.rows[0].content), 'binary');
            /*
               res.send() insists on sticking charset into the content-type
               res.end() can send data back with a 'binary' encoding
           */
        }
    });
});

module.exports = router;