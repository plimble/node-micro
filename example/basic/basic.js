import { Server, Client } from '../../src';
import Registry from '../../src/registry/url';

function add(args, resp) {
  resp(null, args[0] + args[1] + args[2]);
}

const registry = new Registry('http://localhost:3000');

const server = new Server(registry);

server.on('stop', ()=>{
  console.log('server shutdown');
});

server.on('start', ()=>{
  console.log('server connection');
});

server.register('add', add);

server.start('localhost', 3000);
console.log('start server');

const client = new Client(registry);

console.log('call add');

client.call('math', 'add', [1, 2, 3]).then((val)=>{
  console.log(val);
  server.shutdown();
});
