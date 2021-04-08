import http from 'http';
import Koa from 'koa';
import path from 'path';
import { once } from 'events';
import { Config, debugApp, debugConfig } from './config.js';
import { readFileSync } from 'fs';
import Pug from 'koa-pug';
import RunsRouter from './routes/runs.js';

class Server {
    constructor (port) {
        this._port   = port;
        this._app    = new Koa();
        this._pug = new Pug({
            viewPath: path.join(path.resolve(), 'views'),
            basedir:  path.resolve(),
            app:      this._app
        });
        this._runsRouter = new RunsRouter();
        this._server = http.createServer(this._app.callback());
    }

    static create () {
        //NOTE: You need to tap $env:DEBUG="config" in terminal to turn on debug
        debugConfig(Config);

        const { port }    = Config.globals;
        const packageJSON = JSON.parse(readFileSync('./package.json', 'utf8'));

        //NOTE: You need to tap $env:DEBUG="app" in terminal to turn on debug
        debugApp(`${packageJSON.name} booting`);

        return new Server(port);
    }

    async start () {
        const listenPromise = once(this._server, 'listening');

        this._app.use(this._runsRouter.getRouter());
        this._server.listen(this._port);

        return listenPromise;
    }

    async stop () {
        const closePromise = once(this._server, 'close');

        this._server.close();

        return closePromise;
    }
}

export default Server;

