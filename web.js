var gzippo = require('gzippo');
var express = require('express');
var app = express();
    
    app.use(gzippo.staticGzip("" + __dirname + "/dist"));
    // app.use(function(req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "X-Requested-With");
    //     res.header("Access-Control-Allow-Headers", "Content-Type");
    //     res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    //     next();
    // });
    app.listen(process.env.PORT || 5000);