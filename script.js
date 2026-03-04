async function fetchVideo() {
    const urlInput = document.getElementById('videoUrl');
    const btn = document.getElementById('btnAction');
    const resultDiv = document.getElementById('result');
    const errorMsg = document.getElementById('errorMsg');
    const downloadBtn = document.getElementById('downloadLink');

    const url = urlInput.value.trim();

    if (!url) {
        alert("Masukkan link video dulu ya!");
        return;
    }

    // Efek Loading
    btn.innerText = "Sabar, lagi proses...";
    btn.disabled = true;
    resultDiv.classList.add('hidden');
    errorMsg.classList.add('hidden');

    try {
        // Menggunakan API TikWM
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const result = await response.json();

        if (result.code === 0) {
            // PERBAIKAN DI SINI:
            // Kita ambil link video langsung dari data play tanpa menambah domain lagi
            const videoUrl = result.data.play; 
            
            downloadBtn.href = videoUrl;
            resultDiv.classList.remove('hidden');
        } else {
            throw new Error("Gagal mengambil video. Link mungkin salah atau video diprivat.");
        }
    } catch (err) {
        errorMsg.innerText = err.message;
        errorMsg.classList.remove('hidden');
    } finally {
        btn.innerText = "Ambil Video";
        btn.disabled = false;
    }
}
