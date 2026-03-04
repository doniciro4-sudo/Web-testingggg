async function fetchVideo() {
    const input = document.getElementById('videoUrl');
    const btn = document.getElementById('btnAction');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const resultDiv = document.getElementById('result');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMsg = document.getElementById('errorMsg');

    const url = input.value.trim();
    if (!url) {
        input.style.borderColor = "#ff0050";
        setTimeout(() => input.style.borderColor = "rgba(255, 255, 255, 0.1)", 1000);
        return;
    }

    // STATE LOADING (Tanpa Emoji)
    btnText.innerText = "PROSES PENGECEKAN";
    btnLoader.classList.remove('hidden');
    btn.disabled = true;
    resultDiv.classList.add('hidden');
    errorMsg.classList.add('hidden');

    try {
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const json = await response.json();

        if (json.code === 0) {
            const videoUrl = json.data.play;

            downloadBtn.onclick = async (e) => {
                e.preventDefault();
                downloadBtn.innerText = "SEDANG MENGUNDUH...";
                downloadBtn.disabled = true;
                
                try {
                    const res = await fetch(videoUrl);
                    const blob = await res.blob();
                    const bUrl = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = bUrl;
                    a.download = `TIKSAVE_${Date.now()}.mp4`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    downloadBtn.innerText = "UNDUH BERHASIL";
                    setTimeout(() => {
                        downloadBtn.innerText = "UNDUH SEKARANG";
                        downloadBtn.disabled = false;
                    }, 2000);
                } catch (err) {
                    window.open(videoUrl, '_blank');
                    downloadBtn.innerText = "UNDUH SEKARANG";
                    downloadBtn.disabled = false;
                }
            };

            resultDiv.classList.remove('hidden');
        } else {
            throw new Error("TAUTAN TIDAK VALID ATAU PRIVAT");
        }
    } catch (err) {
        errorMsg.innerText = "KESALAHAN: " + err.message;
        errorMsg.classList.remove('hidden');
    } finally {
        btnText.innerText = "AMBIL VIDEO";
        btnLoader.classList.add('hidden');
        btn.disabled = false;
    }
}
