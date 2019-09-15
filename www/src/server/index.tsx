import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import {ServerStyleSheet, StyleSheetManager} from 'styled-components';
import Helmet from 'react-helmet';
import {Root} from '../client/Root.react';
import {StaticRouterContext} from './StaticRouterContext';

export interface WWWServerOptions {
  host: string;
  port: number;
}

export class WWWServer {
  options: WWWServerOptions;

  app: express.Application;

  server: http.Server;

  indexHTML: string;

  constructor({host = '127.0.0.1', port = 80}: Partial<WWWServerOptions> = {}) {
    this.options = {
      host,
      port,
    };
    const clientDir = path.resolve(__dirname, '../../dist/client');
    const serverDir = path.resolve(__dirname, '../../dist/server');
    this.indexHTML = fs.readFileSync(`${serverDir}/index.html`, 'utf8');
    this.app = express();
    this.app.use(express.static(clientDir));
    this.app.get('/*', this.ssr.bind(this));
  }

  start(): void {
    const {host, port} = this.options;
    this.server = this.app.listen(port, host, undefined);
  }

  stop(): void {
    this.server.close();
  }

  get url(): string {
    const {host, port} = this.options;
    return `http://${host}:${port}`;
  }

  ssr(req: express.Request, res: express.Response): void {
    let html;
    const context: StaticRouterContext = {};
    const sheet = new ServerStyleSheet();
    const helmet = Helmet.renderStatic();
    try {
      const root = ReactDOMServer.renderToString(
        <StyleSheetManager sheet={sheet.instance}>
          <StaticRouter location={req.url} context={context}>
            <Root />
          </StaticRouter>
        </StyleSheetManager>,
      );
      const styleTags = sheet.getStyleTags();
      html = this.indexHTML
        .replace(
          /<\/head>/,
          `${[
            String(helmet.title),
            String(helmet.meta),
            String(helmet.link),
            String(helmet.style),
            styleTags,
          ].join('')}</head>`,
        )
        .replace(/<body>/, `<body><div id="root">${root}</div>`);
    } finally {
      sheet.seal();
    }
    if (context.url) {
      res.redirect(302, context.url);
      return;
    }
    res.writeHead(context.status || 200, {
      'Content-Type': 'text/html',
    });
    res.end(html);
  }
}
