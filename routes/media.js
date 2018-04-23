const express = require('express');
const router = express.Router();
const cassandra = require('cassandra-driver');
//multer is used for uploading files.
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const mime = require('mime-types') //content-type utility
const client = new cassandra.Client({ contactPoints: ['192.168.1.36:9042', '192.168.1.37:9042', '192.168.1.38:9042'], keyspace: 'media' });//connect to the cluster

var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211', { retries: 10 });

//addmedia endpoint
router.post('/addmedia', upload.single('content'), function (req, res) {

    var id = (new Date).getTime().toString(); //create unique id for each item in cassandra
    var content = req.file.buffer;

    const query = 'INSERT INTO media (id, content) VALUES (?, ?)';

    const params = [id, content];
    client.execute(query, params, { prepare: true }, function (err) {
        if (err) {
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

    memcached.get(id, function (err, data) {
        if (err || (typeof data === 'undefined')) {
            console.log('cache miss, access to database');

            const query = 'SELECT content FROM media WHERE id = ?';

            var mimetype = mime.lookup(id);
            res.set('Content-Type', mimetype);

            const params = [id];
            client.execute(query, params, { prepare: true }, function (err, result) {
                if (err) {
                    console.log(err);
                    console.log('**ERROR** in client.execute');
                }
                else {
                    console.log('retrieved image succesfully');
                    memcached.add(id, result.rows[0].content, 90, function (err) {
                        if (err) {
                            console.log('error detected while saving content in memcached\n' + err);
                            res.status(200).json({
                                status: 'error',
                                error: 'error detected while saving content in memcached'
                            });
                            return;
                        }
                        else {
                            console.log('saved content in memcached');
                        }
                    });
                    /*
                       res.send() insists on sticking charset into the content-type
                       res.end() can send data back with a 'binary' encoding
                   */
                    res.end(new Buffer(result.rows[0].content), 'binary');
                }
            });

        }
        else {
            console.log('retrieved from memcached');
            res.end(new Buffer(data), 'binary');
        }
    })
});



module.exports = router;