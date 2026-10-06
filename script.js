const form = document.getElementById("registrationForm");
const statusEl = document.getElementById("status");
const quota = 50;
const quotaText = document.getElementById("quotaText");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
const successBox = document.getElementById("successBox");
const closedBox = document.getElementById("closedBox");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");

// GANTI dengan URL Web App Google Apps Script Anda.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx7V92gY4tvxGIhAs1gSKaScueACiXSuvFxwJdsG-iDdr71gMqMBa67MdmwksQEBxB0_Q/exec";

quotaText.textContent = quota;

function setProgress(total) {
  const count = Math.min(Math.max(Number(total) || 0, 0), quota);
  progressText.textContent = `${count} / ${quota}`;
  progressBar.style.width = `${(count / quota) * 100}%`;
  if (count >= quota) {
    form.style.display = "none";
    closedBox.style.display = "block";
  }
}

async function loadQuota() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_URL")) {
    setProgress(0);
    statusEl.textContent = "Website belum dihubungkan ke Google Sheets. Masukkan URL Apps Script pada script.js.";
    return;
  }
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=count`, { cache: "no-store" });
    const data = await res.json();
    if (!data.ok) throw new Error(data.message || "Gagal membaca kuota.");
    setProgress(data.count);
  } catch (err) {
    setProgress(0);
    statusEl.textContent = "Koneksi kuota belum dapat diperiksa. Silakan coba lagi.";
    console.error(err);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";

  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_URL")) {
    statusEl.textContent = "URL Google Apps Script belum dipasang pada script.js.";
    return;
  }

  const payload = {
    email: document.getElementById("email").value.trim(),
    nama: document.getElementById("nama").value.trim(),
    merk: document.getElementById("merk").value.trim(),
    nopol: document.getElementById("nopol").value.trim().toUpperCase(),
    stnk: document.getElementById("stnk").value.trim()
  };

  if (Object.values(payload).some(v => !v)) {
    statusEl.textContent = "Semua data wajib diisi, termasuk ATAS NAMA STNK.";
    return;
  }

  submitBtn.disabled = true;
  btnText.textContent = "MEMPROSES...";

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!data.ok) {
      if (data.full) {
        setProgress(quota);
        statusEl.textContent = "Maaf, kuota 50 pendaftar sudah penuh.";
      } else {
        statusEl.textContent = data.message || "Pendaftaran gagal.";
      }
      return;
    }

    setProgress(data.count);
    document.getElementById("successMessage").textContent =
      `Pendaftaran berhasil. Nomor peserta Anda: ${data.queue}. Data telah tersimpan di Google Sheets. Lokasi: BENGKEL TSM SMKN 1 DOKO.`;
    form.style.display = "none";
    successBox.style.display = "block";
  } catch (err) {
    statusEl.textContent = "Gagal terhubung ke server. Periksa URL Apps Script dan coba lagi.";
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    btnText.textContent = "DAFTAR SEKARANG";
  }
});

loadQuota();
