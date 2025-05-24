const serverBase = 'https://sshi-speedtest-backend.onrender.com';

async function testDownloadSpeed() {
  const downloadElement = document.getElementById('download');
  const downloadBar = document.getElementById('download-bar');
  downloadElement.textContent = 'Testing...';
  if (downloadBar) downloadBar.style.width = '0%';

  const start = performance.now();
  const response = await fetch(`${serverBase}/download?cache=${Math.random()}`);
  const blob = await response.blob();
  const end = performance.now();

  const duration = (end - start) / 1000; // seconds
  const bitsLoaded = blob.size * 8;

  const speedMbps = (bitsLoaded / duration / 1024 / 1024).toFixed(2);
  downloadElement.textContent = speedMbps + ' Mbps';

  // Update progress bar (max 100 Mbps for bar, adjust as needed)
  if (downloadBar) {
    let percent = Math.min((speedMbps / 100) * 100, 100);
    downloadBar.style.width = percent + '%';
  }
}

async function testUploadSpeed() {
  const uploadElement = document.getElementById('upload');
  const uploadBar = document.getElementById('upload-bar');
  uploadElement.textContent = 'Testing...';
  if (uploadBar) uploadBar.style.width = '0%';

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
    if (uploadBar) {
      let percent = Math.min((speedMbps / 100) * 100, 100);
      uploadBar.style.width = percent + '%';
    }
  } else {
    uploadElement.textContent = 'Upload failed';
    if (uploadBar) uploadBar.style.width = '0%';
  }
}

async function testPing() {
  const pingElement = document.getElementById('ping');
  const pingBar = document.getElementById('ping-bar');
  pingElement.textContent = 'Testing...';
  if (pingBar) pingBar.style.width = '0%';

  const pingUrl = `${serverBase}/ping?cache=${Math.random()}`;
  const start = performance.now();

  try {
    await fetch(pingUrl, { method: 'GET', cache: 'no-cache' });
    const end = performance.now();
    const ping = Math.round(end - start);
    pingElement.textContent = ping + ' ms';
    // For ping, lower is better. We'll invert the bar: 0ms = 100%, 200ms+ = 0%
    if (pingBar) {
      let percent = Math.max(100 - (ping / 1000) * 100, 0);
      pingBar.style.width = percent + '%';
    }
  } catch {
    pingElement.textContent = 'Error';
    if (pingBar) pingBar.style.width = '0%';
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