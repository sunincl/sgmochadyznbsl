const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8000;
const root = path.resolve('.');
http.createServer((req, res) => {
  try{
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(root, urlPath);
    if (filePath.endsWith(path.sep)) filePath = path.join(filePath, 'index.html');
    // prevent path traversal
    if (!filePath.startsWith(root)) {
      res.statusCode = 403; res.end('Forbidden'); return;
    }
    if (!fs.existsSync(filePath)) { res.statusCode = 404; res.end('Not found'); return; }
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      if (!fs.existsSync(filePath)) { res.statusCode = 404; res.end('Not found'); return; }
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = {
      '.html':'text/html', '.htm':'text/html', '.js':'application/javascript', '.css':'text/css', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.json':'application/json'
    }[ext] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': mime});
    fs.createReadStream(filePath).pipe(res);
  }catch(e){ res.statusCode=500; res.end('Server error'); }
}).listen(port, ()=>console.log('Static server listening on http://localhost:'+port+'/'));
