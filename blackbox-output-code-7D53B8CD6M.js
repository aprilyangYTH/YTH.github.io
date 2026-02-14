document.getElementById('trackingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const carrier = document.getElementById('carrier').value;
    const number = document.getElementById('trackingNumber').value;
    const apiKey = 'qyl2a5du-fnaa-exz7-dipr-1j7lll11p47h'; // 替換為真實金鑰
    const url = `https://api.trackingmore.com/v2/trackings/get?carrier_code=${carrier}&tracking_number=${number}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Trackingmore-Api-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data); // 調試：檢查API回應
        if (data.meta && data.meta.code === 200) { // 成功代碼
            displayResult(data);
            saveHistory(number, carrier, data);
        } else {
            document.getElementById('result').innerHTML = `<p>查詢失敗: ${data.meta?.message || '未知錯誤'}</p>`;
        }
    } catch (error) {
        console.error(error); // 調試錯誤
        document.getElementById('result').innerHTML = '<p>網路錯誤，請檢查API金鑰。</p>';
    }
});

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    const tracking = data.data?.trackings?.[0];
    if (tracking) {
        resultDiv.innerHTML = `<p><strong>單號:</strong> ${tracking.tracking_number}</p><p><strong>狀態:</strong> ${tracking.status}</p><p><strong>最新更新:</strong> ${tracking.updated_at || '無'}</p>`;
    } else {
        resultDiv.innerHTML = '<p>無查詢結果。</p>';
    }
}

function saveHistory(number, carrier, data) {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const status = data.data?.trackings?.[0]?.status || '未知';
    history.push({ number, carrier, status, date: new Date().toLocaleString() });
    localStorage.setItem('history', JSON.stringify(history));
    loadHistory(); // 立即更新顯示
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('history') || '[]');
    const historyUl = document.getElementById('history');
    historyUl.innerHTML = history.map(item => `<li class="list-group-item">${item.number} (${item.carrier}): ${item.status} - ${item.date}</li>`).join('');
    if (history.length === 0) {
        historyUl.innerHTML = '<li class="list-group-item">無歷史記錄</li>';
    }
}

loadHistory(); // 頁面載入時顯示