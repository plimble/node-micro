import { Server, Client } from '../../src';

function add(x, y, z, resp) {
  resp(null, x + y + z);
}

const server = new Server();

server.on('shutdown', ()=>{
  console.log('server shutdown');
});

server.on('connection', ()=>{
  console.log('server connection');
});

server.register('add', add);

server.start('localhost', 3000);
console.log('start server');

const client = new Client('localhost', 3000);

client.on('message', (err, msg)=>{
  console.log('client message', err, msg);
});

console.log('call add');
client.autoRegister().then(()=>{
  return client.call('add', 1, 2, 3);
}).then((val)=>{
  console.log(val);
  server.shutdown();
});
