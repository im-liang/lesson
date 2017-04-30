var Express = require('express');
var Busboy = require('busboy');
var When = require('When');

exports.getRoute = function (s) {
    var router = Express.Router();

    router.post('/add_resources', function (req, res, next) {
        var ended = false; // flag for output finish
        function writeError(status, err){
            if(ended) return;
            res.status(status).send({result: false, error:err});
            ended = true;
        }

        var fields = {};
        fields.attachmentList = [];
        var attachmentPromises = [];
        var boy = new Busboy({
            headers: req.headers,
            limits:{fields:50, fieldSize:40*1024, files:100, fileSize: 10*1024*1024, headerPairs:1}
        });
        boy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            if(filename.length == 0) {
                writeError(400, 'file is zero byte');
                return file.pipe(BlackHole());
            }
            var fileID = s.mongodb.ObjectID();
            var uploadStream = s.resourceConn.getResourceFileBucket()
                .openUploadStreamWithId(fileID, filename, {metadata:{}, contentType:mimetype});
            var uploadP = When.promise((resolve, reject)=>{
                file.on('limit', function(){
                    writeError(400, 'file is too large');
                    uploadStream.abort(function () {});
                    return reject();
                });
                file.pipe(uploadStream).once('finish', function () {
                    fields.attachmentList.push({name:filename, id:fileID});
                    return resolve();
                });
            });
            attachmentPromises.push(uploadP);
        });
        boy.on('filesLimit', function() {
            writeError(400, 'too many files')
        });
        boy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            fields[fieldname] = val;
        });
        boy.on('fieldsLimit', function() {
            writeError(400, 'too many fields')
        });
        boy.on('finish', function () {
            if(ended) return;
            When.all(attachmentPromises).then(()=>{
                res.send({result: true, files: fields.attachmentList});
            });
        });
        //boy.once('finish', function() {});

        req.pipe(boy);
    });

    router.get('/get_resource', function (req, res, next) {
        var cursor = s.resourceConn.getResourceFileBucket().find({_id:s.mongodb.ObjectID(req.query.id)}, {}).limit(1);
        cursor.next(function (err, doc) {
            if(err) return res.status(400).send({result: false, error:'database error', detail: err.message});
            if(doc == null) return res.status(400).send({result: false, error:'file not found'});

            var outStream = s.resourceConn.getResourceFileBucket().openDownloadStream(doc._id);
            if(req.query.asAttachment) res.setHeader('Content-disposition', 'attachment; filename=' + doc.filename);
            res.setHeader('Content-length', doc.length.toString());
            if(doc.contentType) res.setHeader('Content-Type', doc.contentType);
            res.setHeader('Access-Control-Allow-Origin', '*');
            outStream.pipe(res);
            cursor.close();
        });
    });

    return router;
};