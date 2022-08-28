//Based on https://developer.mozilla.org/en-US/docs/Learn/Server-side/Node_server_without_framework

const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
    console.log('req ', req.url)

    let filePath = '.' + req.url
    //server .index.html by default
    if (filePath == './') {
        filePath = './' + 'todo.html'
    }

    let extname = String(path.extname(filePath)).toLowerCase()
    let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    let contentType = mimeTypes[extname] || 'application/octet-stream'

    if (req.url == '/read') {
        fs.readFile("./data/todos.txt", (err, data) => {
            res.end(data, 'utf-8');
        })
    }

    else if (req.url == '/add') {
        let add = '';
        req.on('data', chunk => {
            add += chunk.toString(); 
        });
        req.on('end', () => {
            console.log(add);
            fs.appendFile("./data/todos.txt", "\n"+add, (err, data) => {
                res.end(data, 'utf-8');
            });
        });
    }

    else if (req.url == '/delete') {
        let pos = '';
        req.on('data', chunk => {
            pos += chunk.toString(); 
        });
        req.on('end', () => {
            var newFile;
            fs.readFile("./data/todos.txt", (err, data) => {
                newFile = data.toString().split("\n");
                newFile.splice(pos, 1);
                newFile = newFile.join("\n");
                fs.writeFile("./data/todos.txt", newFile, {encoding: 'utf-8', flag: "w"}, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        });
    }


    else {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    fs.readFile('./404.html', (err, data) => {
                        res.writeHead(404, { 'Content-Type': 'text/html' })
                        res.end(data, 'utf-8')
                    });
                }
                else {
                    res.writeHead(500)
                    res.end('Error 500: ' + err.code)
                }
            }
            else {
                res.setHeader('Cache-Control', 'no-store')
                res.writeHead(200, { 'Content-Type': contentType })
                res.end(data, 'utf-8')
            }
        });
    }

})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
