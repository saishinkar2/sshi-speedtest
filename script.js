const serverBase = 'https://sshi-speedtest-backend.onrender.com';

async function testDownloadSpeed() {
  const downloadElement = document.getElementById('download');
  downloadElement.textContent = 'Testing...';

  const start = performance.now();
  const response = await fetch(`${serverBase}/download?cache=${Math.random()}`);
  const blob = await response.blob();
  const end = performance.now();

  const duration = (end - start) / 1000; // seconds
  const bitsLoaded = blob.size * 8;

  const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
  downloadElement.textContent = speedMbps + ' Mbps';
}

async function testUploadSpeed() {
  const uploadElement = document.getElementById('upload');
  uploadElement.textContent = 'Testing...';

  const dataSize = 2 * 1024 * 1024; // 2MB
  const data = new Uint8Array(dataSize);
  for (let i = 0; i < dataSize; i++) {
    data[i] = Math.floor(Math.random() * 256);
  }

  const start = performance.now();
  const response = await fetch(`${serverBase}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream'
    },
    body: data,
  });
  const end = performance.now();

  const duration = (end - start) / 1000;
  const bitsUploaded = dataSize * 8;
  const speedMbps = (bitsUploaded / duration / 1024 / 1024).toFixed(2);

  if (response.ok) {
    uploadElement.textContent = speedMbps + ' Mbps';
  } else {
    uploadElement.textContent = 'Upload failed';
  }
}

async function testPing() {
  const pingElement = document.getElementById('ping');
  pingElement.textContent = 'Testing...';

  const pingUrl = `${serverBase}/ping?cache=${Math.random()}`;
  const start = performance.now();

  try {
    await fetch(pingUrl, { method: 'GET', cache: 'no-cache' });
    const end = performance.now();
    const ping = Math.round(end - start);
    pingElement.textContent = ping + ' ms';
  } catch {
    pingElement.textContent = 'Error';
  }
}

document.getElementById('start').addEventListener('click', async () => {
  try {
    await testDownloadSpeed();
    await testUploadSpeed();
    await testPing();
  } catch (error) {
    console.error('Speed test error:', error);
  }
});
