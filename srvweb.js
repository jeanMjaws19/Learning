import {createServer} from 'http';

require('dotenv').config();

const server = createServer((Request, Response) => {
    if(request.method === 'GET' && request.url === '/ping') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(req.headers));
    }
    else {
        res.writeHead(404);
        res.end();
    }}
)
    
server.listen(PING_LISTEN_PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PING_LISTEN_PORT}`);     
})