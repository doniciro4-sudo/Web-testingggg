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
        input.classList.add('border-red-500');
        setTimeout(() => input.classList.remove('border-red-500'), 1000);
        return;
    }

    // STATE LOADING (Tanpa Emoji)
    btnText.innerText = "SEDANG MEMPROSES";
    btnLoader.classList.remove('hidden');
    btn.disabled = true;
    resultDiv.classList.add('hidden');
    errorMsg.classList.add('hidden');

    try {
        // Mengambil data dari API TikWM
        const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
        const json = await response.json();

        if (json.code === 0) {
            const videoUrl = json.data.play;

            downloadBtn.onclick = async (e) => {
                e.preventDefault();
                downloadBtn.innerText = "MENGUNDUH FILE...";
                downloadBtn.disabled = true;
                
                try {
                    const res = await fetch(videoUrl);
                    const blob = await res.blob();
                    const bUrl = URL.createObjectURL(blob);
                    
                    const a = document.createElement('a');
                    a.href = bUrl;
                    a.download = `TikSave_Video_${Date.now()}.mp4`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    
                    downloadBtn.innerText = "UNDUH SELESAI";
                    setTimeout(() => {
                        downloadBtn.innerText = "SIMPAN KE GALERI";
                        downloadBtn.disabled = false;
                    }, 2000);
                } catch (err) {
                    // Fallback jika fetch blob gagal
                    window.open(videoUrl, '_blank');
                    downloadBtn.innerText = "SIMPAN KE GALERI";
                    downloadBtn.disabled = false;
                }
            };

            // Menampilkan hasil dengan efek transisi
            resultDiv.classList.remove('hidden');
            resultDiv.classList.add('fade-up');
        } else {
            throw new Error("Tautan tidak valid atau video bersifat privat.");
        }
    } catch (err) {
        errorMsg.innerText = "KESALAHAN: " + err.message;
        errorMsg.classList.remove('hidden');
    } finally {
        // MENGEMBALIKAN STATE TOMBOL
        btnText.innerText = "AMBIL VIDEO";
        btnLoader.classList.add('hidden');
        btn.disabled = false;
    }
}
