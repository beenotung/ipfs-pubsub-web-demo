(window as any).setImmediate = require('async/setImmediate');
// import 'libp2p';
// import 'libp2p-websockets';
// import 'libp2p-websocket-star';
// import 'libp2p-webrtc-star';
// import IPFS = require('ipfs');
import IPFS = require('typestub-ipfs');
import { IPFSGetResult } from 'typestub-ipfs';

// browser start
const ipfs = new IPFS({
  config: {
    Addresses: {
      Swarm: [
        '/dns4/star-signal.cloud.ipfs.team/tcp/443/wss/p2p-webrtc-star',
      ],
      API: '',
      Gateway: '',
    },
    EXPERIMENTAL: {
      pubsub: true,
    },
  });
(window as any).ipfs = ipfs;
ipfs.on('error', e => console.error('ipfs error:', e));
ipfs.on('ready', () => {
  console.log('ipfs ready');
  console.log('pubsub:', ipfs.pubsub);
  // ipfs.pubsub.subscribe('message', x => console.log('subscribe:', x));
  ipfs.pubsub.publish(JSON.stringify({ user: 'beeno', msg: 'hello' }));
});


let test = (async () => {
  let node = new IPFS();
  node.on('error', error => console.error(error.message));

  console.log('waiting node...');
  await new Promise((resolve, reject) => node.on('ready', resolve));
  console.log('node is ready.');

  console.log('adding file...');
  // FIXME first argument cannot be string?
  let files = await node.files.add(new Buffer('hello'));
  console.log('added file:', { files });

  let hash = files[0].hash;
  console.log('getting file...');
  let res = (await node.files.get(hash)) as IPFSGetResult[];
  console.log('got file:', { res });
  let content = res[0].content.toString();
  console.log('file content: ' + content);

  console.log('closing node...');
  await new Promise((resolve, reject) => node.stop(() => resolve));
  console.log('closed node.');
});
