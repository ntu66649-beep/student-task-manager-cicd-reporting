const http = require('http');
const fs = require('fs');
const path = require('path');

const REQUESTED_PORT = Number.parseInt(process.env.PORT || '3000', 10);
const PUBLIC_DIR = path.join(__dirname, 'src');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Decode the URL path before resolving it so encoded traversal is rejected too.
  let reqPath;
  try {
    reqPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 Bad Request');
    return;
  }
  if (reqPath === '/') reqPath = '/index.html';

  const filePath = path.resolve(PUBLIC_DIR, `.${reqPath}`);
  const relativePath = path.relative(PUBLIC_DIR, filePath);

  // A path is inside the public directory only if it is itself or a descendant.
  if (relativePath === '..' || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

if (!Number.isInteger(REQUESTED_PORT) || REQUESTED_PORT < 0 || REQUESTED_PORT > 65535) {
  console.error('PORT must be a number between 0 and 65535.');
  process.exitCode = 1;
} else {
  server.on('error', error => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${REQUESTED_PORT} is already in use. Stop the existing server, then run npm start again.`);
    } else {
      console.error(`Unable to start the web server: ${error.message}`);
    }
    process.exitCode = 1;
  });

  server.listen(REQUESTED_PORT, () => {
    console.log(`Student Task Manager Server is running at http://localhost:${REQUESTED_PORT}`);
  });
}
