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
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxR1dMkkYrWULd9x57mNcZt6ExOSFujX0HJWQkkEiJio2CeXxn02nfwh2mpLt7FfIIz/exec";
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

function loadQuota() {
  if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes("PASTE_URL")) {
    setProgress(0);
    statusEl.textContent =
      "Website belum terhubung ke Google Sheets.";
    return;
  }

  const callbackName =
    "quotaCallback_" + Date.now();

  window[callbackName] = function(data) {

    try {

      if (!data.success) {
        throw new Error(
          data.message || "Gagal membaca kuota."
        );
      }

      console.log("Data kuota:", data);

      setProgress(data.total);

      statusEl.textContent =
        `${data.total} pendaftar dari ${data.quota} kuota`;

    } catch (error) {

      console.error(error);

      setProgress(0);

      statusEl.textContent =
        "Data kuota tidak dapat dibaca.";

    } finally {

      delete window[callbackName];

      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }

    }
  };

  const script = document.createElement("script");

  script.src =
    `${APPS_SCRIPT_URL}?action=count&callback=${callbackName}&t=${Date.now()}`;

  script.onerror = function() {

    setProgress(0);

    statusEl.textContent =
      "Koneksi ke Google Sheets gagal.";

    delete window[callbackName];

    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };

  document.body.appendChild(script);
}

    setProgress(data.total);

  } catch (err) {
    setProgress(0);
    statusEl.textContent =
      "Koneksi kuota belum dapat diperiksa. Silakan coba lagi.";
    console.error(err);
  }
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
