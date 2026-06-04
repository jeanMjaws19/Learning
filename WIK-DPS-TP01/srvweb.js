import {createServer} from 'http';
import dotenv from 'dotenv';
dotenv.config();

const port = process.env.PING_LISTEN_PORT || 8080;
const server = createServer((Request, Response) => {
    if(Request.method === 'GET' && Request.url === '/ping') {
        Response.writeHead(200, {'Content-Type': 'application/json'});
        Response.end(JSON.stringify(Request.headers));
    }
    else {
        Response.writeHead(404);
        Response.end();
    }}
)
    
server.listen(port, '0.0.0.0', () => {
    console.log(`Listening on port ${port}`);     
})