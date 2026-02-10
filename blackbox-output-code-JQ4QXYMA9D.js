document.getElementById('trackingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const carrier = document.getElementById('carrier').value;
    const trackingNumber = document.getElementById('trackingNumber').value;
    queryTracking(carrier, trackingNumber);
});

async function queryTracking(carrier, number) {
    const apiKey = 'sk-P3c70koS4LK2cOv6puPtbg'; // 替換為你的API金鑰
    const url = `https://api.trackingmore.com/v2/trackings/get?carrier_code=${carrier}&tracking_number=${number}`; // TrackingMore API範例，檢查官方文件

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Trackingmore-Api-Key': apiKey,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        displayResult(data);
    } catch (error) {
        document.getElementById('result').innerHTML = '<p>查詢失敗，請檢查單號或網路。</p>';
    }
}

function displayResult(data) {
    const resultDiv = document.getElementById('result');
    if (data.data && data.data.trackings && data.data.trackings.length > 0) {
        const tracking = data.data.trackings[0];
        let html = `<h2>查詢結果</h2>`;
        html += `<p><strong>單號：</strong>${tracking.tracking_number}</p>`;
        html += `<p><strong>物流商：</strong>${tracking.carrier_code}</p>`;
        html += `<p><strong>狀態：</strong>${tracking.status}</p>`;
        if (tracking.origin_info && tracking.origin_info.trackinfo) {
            html += `<h3>動態</h3>`;
            tracking.origin_info.trackinfo.forEach(info => {
                html += `<div class="status"><strong>${info.Date} ${info.StatusDescription}</strong><br>${info.Details}</div>`;
            });
        }
        resultDiv.innerHTML = html;
    } else {
        resultDiv.innerHTML = '<p>無查詢結果，請檢查單號。</p>';
    }
}
