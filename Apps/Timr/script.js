function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    const secondsStr = `${seconds}`;
    document.getElementById('time').textContent = timeStr;
    document.getElementById('seconds').textContent = secondsStr;
  }
  setInterval(updateTime, 1000);