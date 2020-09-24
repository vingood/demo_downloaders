const http = require('https');
const os = require('os');
const fs = require('fs').promises;

async function getFileList(fromFileName) {
  const file = await fs.readFile(fromFileName);

  return file.toString().split('\n').filter(str => str);
}

function getBaseNameFromUrl(uri) {
  const url = require('url');
  const path = require('path');

  return path.basename(url.parse(uri).pathname);
}

async function fetchFile(filename) {
  return new Promise((resolve, reject) => {
    console.log(`Begin downloading: ${filename}`);

    http.get(filename, res => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Request ${filename} Failed. Status Code: ${res.statusCode}`));
      }

      let body = '';
      res.on('data', data => body += data);
      res.on('end', _ => resolve(body));
      res.on('error', reject);
    });
  })
}

(async _ => {
  const time = Date.now();

  const fileNames = await getFileList(process.env.CONTENT_FILE);

  await Promise.all(fileNames.map(async url => {
    const baseName = getBaseNameFromUrl(url);
    const filename = `${os.tmpdir()}/${baseName}`;

    try {
      const body = await fetchFile(url)
      await fs.writeFile(filename, body);
      console.log(`Finished writing: ${filename}`)
    } catch(e) {
      console.log(`Error download: ${e.message}`);
    }
  }));

  console.log(`Execution time: ${(Date.now() - time) / 1000} second(s)`);
})();
