const express = require('express');
const router = express.Router();
const cassandra = require('cassandra-driver');
//multer is used for uploading files.
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mime = require('mime-types') //content-type utility
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'db' });//connect to the cluster


//addmedia endpoint
router.post('/deposit', upload.single('content'), function (req, res) {
    // check if logged in
    /*
    if (typeof (req.cookies.username) == 'undefined') {
        res.status(200).json({
            status: 'error',
            error: 'No current user'
        });
        return;
    }
    */

    //var username = req.cookies.username;
    var id = now().toString();
    var content = req.file.buffer;

    console.log(req.file);

    const query = 'INSERT INTO media (mediaId, content) VALUES (?, ?)';

    const params = [id, content];
    client.execute(query, params, { prepare: true }, function (err) {
        if (err) {
            res.status(200).json({
                status: 'error',
                error: 'failed to save media in cassandra'
            });
        }
        else {
            console.log('Inserted media '+params[0]+' in the cluster');
            console.log("--------------------------------------------");
            res.status(200).json({
                status: 'OK',
                id: id
            });
        }
    });

});

router.get('/media/:id', (req, res, next) => {
    
    var id = req.params.id;
    console.log(id);
  
    const query = 'SELECT contents FROM media WHERE id = ?';
  
    var mimetype = mime.lookup(id);
    res.set('Content-Type', mimetype);
  
    const params = [id];
    client.execute(query, params, { prepare: true }, function(err, result) {
        if (err){
          console.log(err);
          console.log('**ERROR** in client.execute');
        }
        else{
          console.log('retrieved image succesfuly');
          
          /*
              res.send() insists on sticking charset into the content-type
              res.end() can send data back with a 'binary' encoding
          */
          res.end(new Buffer(result.rows[0].content), 'binary');
        }
    });
});



module.exports = router;
