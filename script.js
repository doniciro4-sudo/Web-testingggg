async function fetchVideo() {
    const input = document.getElementById('videoUrl');
    const btn = document.getElementById('btnAction');
    const resultDiv = document.getElementById('result');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorBox = document.getElementById('errorBox');
    const errorMsg = document.getElementById('errorMsg');

    const url = input.value.trim();
    if (!url) return alert("Masukkan link-nya dulu!");

    // UI Loading State
    btn.innerText = "⏳ Sedang Memproses...";
    btn.disabled = true;
    resultDiv.classList.add('hidden');
    errorBox.classList.add('hidden');

    try {
        // Kita gunakan API yang lebih luas jangkauannya
        const response = await fetch(`https://api.vkrfork.com/api/v1/all?url=${encodeURIComponent(url)}`);
        const data = await response.json();

        let finalUrl = "";

        // Logika Pengambilan URL (Multi-Source)
        if (data.data && data.data.main_url) {
            finalUrl = data.data.main_url;
        } else if (data.url) {
            finalUrl = data.url;
        } else if (data.medias && data.medias[0]) {
            finalUrl = data.medias[0].url;
        }

        if (!finalUrl) throw new Error("Video tidak ditemukan atau link tidak publik.");

        // Tombol Download
        downloadBtn.onclick = (e) => {
            e.preventDefault();
            
            // Trik paksa download atau buka tab baru jika diblokir browser
            const a = document.createElement('a');
            a.href = finalUrl;
            a.target = '_blank';
            a.download = `Video_Downloaded_${Date.now()}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };

        resultDiv.classList.remove('hidden');

    } catch (err) {
        errorMsg.innerText = "Error: " + err.message;
        errorBox.classList.remove('hidden');
    } finally {
        btn.innerText = "Ambil Video";
        btn.disabled = false;
    }
}
