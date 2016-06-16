/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2016 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////
import {serverConfig as config} from 'c0nfig'

//Server stuff
import cookieParser from 'cookie-parser'
import io from 'socket.io'
import Session from 'express-session'
import bodyParser from 'body-parser'
import favicon from 'serve-favicon'
import express from 'express'

//Webpack hot reloading stuff
import webpackConfig from '../../webpack/webpack.config.development';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpack from 'webpack';

//Endpoints
import DerivativeAPI from './api/endpoints/derivative'
import TokenAPI from './api/endpoints/token'
import UserAPI from './api/endpoints/user'
import AuthAPI from './api/endpoints/auth'
import DMAPI from './api/endpoints/dm'
import Roomedit3dApi from './api/endpoints/roomedit3d'

//Services
import DerivativeSvc from './api/services/DerivativeSvc';
import SocketSvc from './api/services/SocketSvc';
import DMSvc from './api/services/DMSvc';

/////////////////////////////////////////////////////////////////////
// Webpack hot-reloading setup
//
/////////////////////////////////////////////////////////////////////
function setWebpackHotReloading(app) {

    var compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath
    }));

    app.use(webpackHotMiddleware(compiler));
}

/////////////////////////////////////////////////////////////////////
// App initialization
//
/////////////////////////////////////////////////////////////////////
var app = express()

if(process.env.WEBPACK == 'hot')
    setWebpackHotReloading(app);

app.use('/resources', express.static(__dirname + '/../../resources'))
app.use(favicon(__dirname + '/../../resources/img/forge.png'))
app.use('/', express.static(__dirname + '/../../dist/'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

var store = new Session.MemoryStore;

var session = Session({
    secret: 'peperonipizza',
    saveUninitialized: true,
    resave: true,
    store: store
})

app.use(session)

/////////////////////////////////////////////////////////////////////
// Routes setup
//
/////////////////////////////////////////////////////////////////////
app.use('/api/derivative', DerivativeAPI())
app.use('/api/token', TokenAPI())
app.use('/api/user', UserAPI())
app.use('/api/auth', AuthAPI())
app.use('/api/dm', DMAPI())

/////////////////////////////////////////////////////////////////////
// server setup
//
/////////////////////////////////////////////////////////////////////
app.set('port', process.env.PORT || config.port || 3000)

var server = app.listen(app.get('port'), function() {

    var socketSvc = new SocketSvc({
        config: {
            server,
            session
        }
    });

    var dmSvc = new DMSvc({
        config: config
    })

    var derivativeSvc = new DerivativeSvc({
        config: config
    })

    var io2 = io(server);
    app.use('/api/roomedit3d', Roomedit3dApi(io2));

    console.log('Server listening on: ')
    console.log(server.address())
})
