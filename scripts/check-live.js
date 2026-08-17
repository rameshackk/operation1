import https from 'https';

https.get('https://operation1-rho.vercel.app/', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status code:', res.statusCode);
    const scriptMatch = body.match(/bundle\.compiled\.js\?[^"]+/);
    console.log('Bundle script in production HTML:', scriptMatch ? scriptMatch[0] : 'not found');
  });
}).on('error', err => console.error(err));
