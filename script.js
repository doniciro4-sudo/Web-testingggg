import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// KONFIGURASI FIREBASE KAMU
const firebaseConfig = {
  apiKey: "AIzaSyBdPyIdAM2WThbACPMXuO4BR0862sjJvGk",
  authDomain: "tiksave-pro-e32c5.firebaseapp.com",
  projectId: "tiksave-pro-e32c5",
  storageBucket: "tiksave-pro-e32c5.firebasestorage.app",
  messagingSenderId: "163327438786",
  appId: "1:163327438786:web:b1526c29d2a80f3ac2305b",
  measurementId: "G-69N55XZYVZ",
  databaseURL: "https://tiksave-pro-e32c5-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// FUNGSI AMBIL IP ADDRESS (IPIFY)
async function getIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (e) {
        return "IP Tidak Diketahui";
    }
}

// FUNGSI SIMPAN DATA KE FIREBASE (IP, PERANGKAT, DLL)
async function saveDownloadLog(videoUrl) {
    try {
        const userIP = await getIP();
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;

        await push(ref(db, 'laporan_download'), {
            url_tiktok: videoUrl,
            timestamp: serverTimestamp(),
            ip_address: userIP,
            perangkat: platform,
            user_agent: userAgent,
            waktu_lokal: new Date().toLocaleString('id-ID')
        });
        console.log("Log Detail Berhasil Disimpan!");
    } catch (e) {
        console.error("Gagal simpan log:", e);
    }
}

// FUNGSI UTAMA DOWNLOADER
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

    // LOADING STATE
    btnText.innerText = "MENCARI VIDEO...";
    if(btnLoader) btnLoader.classList.remove('hidden');
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
                downloadBtn.innerText = "MENCATAT DATA...";
                downloadBtn.disabled = true;
                
                // JALANKAN FITUR SIMPAN IP & DATA
                await saveDownloadLog(url);
                
                downloadBtn.innerText = "MENGUNDUH...";
                
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
                    
                    downloadBtn.innerText = "SELESAI!";
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
            throw new Error("Video tidak ditemukan atau privat.");
        }
    } catch (err) {
        errorMsg.innerText = "ERROR: " + err.message;
        errorMsg.classList.remove('hidden');
    } finally {
        btnText.innerText = "AMBIL VIDEO";
        if(btnLoader) btnLoader.classList.add('hidden');
        btn.disabled = false;
    }
}

// Pasang Event Listener ke tombol
document.getElementById('btnAction').addEventListener('click', fetchVideo);
