async function fetchVideo() {
    const input = document.getElementById('videoUrl');
    const btn = document.getElementById('btnAction');
    const resultDiv = document.getElementById('result');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorMsg = document.getElementById('errorMsg');

    const url = input.value.trim();
    if (!url) return alert("Tempel link-nya dulu!");

    btn.innerText = "🔍 Sedang Mencari...";
    btn.disabled = true;
    resultDiv.classList.add('hidden');
    errorMsg.classList.add('hidden');

    try {
        // Kita pakai API Multi yang lebih luas dukungannya
        // Menggunakan bantuan proxy 'cors-anywhere' jika diperlukan
        const apiRes = await fetch(`https://api.vkrfork.com/api/v1/all?url=${encodeURIComponent(url)}`);
        
        if (!apiRes.ok) throw new Error("Gagal menyambung ke server.");
        
        const data = await apiRes.json();

        // Ambil link video terbaik (biasanya ada di urutan pertama)
        let videoUrl = "";
        if (data.data && data.data.main_url) {
            videoUrl = data.data.main_url;
        } else if (data.url) {
            videoUrl = data.url;
        } else if (data.medias) {
            videoUrl = data.medias[0].url;
        }

        if (!videoUrl) throw new Error("Video tidak ditemukan. Pastikan akun tidak diprivat.");

        // Pasang link ke tombol
        downloadBtn.onclick = async (e) => {
            e.preventDefault();
            downloadBtn.innerText = "📥 Mengunduh...";
            
            try {
                const res = await fetch(videoUrl);
                const blob = await res.blob();
                const localUrl = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = localUrl;
                a.download = `VGet_${Date.now()}.mp4`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(localUrl);
                downloadBtn.innerText = "✅ Selesai!";
            } catch (err) {
                // Jika diblokir browser, langsung buka link aslinya
                window.open(videoUrl, '_blank');
                downloadBtn.innerText = "Simpan ke Galeri";
            }
        };

        resultDiv.classList.remove('hidden');
        downloadBtn.innerText = "Download Video";

    } catch (err) {
        errorMsg.innerText = "Error: " + err.message;
        errorMsg.classList.remove('hidden');
    } finally {
        btn.innerText = "Ambil Video";
        btn.disabled = false;
    }
}
