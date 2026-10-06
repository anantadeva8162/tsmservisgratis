// ======================================================
// KONFIGURASI GOOGLE APPS SCRIPT
// ======================================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwrhhS7VFrOi__IJ9B7ADVOjv2_1me8pzOuMWoCM7xzF70d2YyseNo0hHiMiO6tn-me/exec";


// ======================================================
// MENUNGGU HALAMAN SELESAI DIMUAT
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // Cari form
    const form = document.querySelector("form");

    if (!form) {
        console.error("FORM TIDAK DITEMUKAN!");
        return;
    }

    console.log("Form ditemukan.");
    console.log("Google Apps Script URL:", SCRIPT_URL);


    // ==================================================
    // EVENT SUBMIT FORM
    // ==================================================

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("Tombol submit ditekan.");


        // ----------------------------------------------
        // AMBIL DATA INPUT
        // ----------------------------------------------

        const namaInput =
            document.getElementById("nama") ||
            document.getElementById("namaGuru") ||
            document.querySelector('[name="nama"]');

        const whatsappInput =
            document.getElementById("whatsapp") ||
            document.getElementById("noWhatsapp") ||
            document.querySelector('[name="whatsapp"]');

        const merkInput =
            document.getElementById("merk") ||
            document.getElementById("merkMotor") ||
            document.querySelector('[name="merk"]');

        const nopolInput =
            document.getElementById("nopol") ||
            document.getElementById("nomorPolisi") ||
            document.querySelector('[name="nopol"]');


        // ----------------------------------------------
        // CEK INPUT
        // ----------------------------------------------

        if (!namaInput) {
            alert("Input nama tidak ditemukan.");
            console.error("Input nama tidak ditemukan.");
            return;
        }

        if (!whatsappInput) {
            alert("Input nomor WhatsApp tidak ditemukan.");
            console.error("Input WhatsApp tidak ditemukan.");
            return;
        }

        if (!merkInput) {
            alert("Input merek sepeda motor tidak ditemukan.");
            console.error("Input merek tidak ditemukan.");
            return;
        }

        if (!nopolInput) {
            alert("Input nomor polisi tidak ditemukan.");
            console.error("Input nomor polisi tidak ditemukan.");
            return;
        }


        // ----------------------------------------------
        // BERSIHKAN DATA
        // ----------------------------------------------

        const nama = namaInput.value.trim();
        const whatsapp = whatsappInput.value.trim();
        const merk = merkInput.value.trim();
        const nopol = nopolInput.value.trim();


        // ----------------------------------------------
        // VALIDASI
        // ----------------------------------------------

        if (nama === "") {
            alert("Silakan masukkan nama.");
            namaInput.focus();
            return;
        }

        if (whatsapp === "") {
            alert("Silakan masukkan nomor WhatsApp.");
            whatsappInput.focus();
            return;
        }

        if (merk === "") {
            alert("Silakan masukkan merek sepeda motor.");
            merkInput.focus();
            return;
        }

        if (nopol === "") {
            alert("Silakan masukkan nomor polisi.");
            nopolInput.focus();
            return;
        }


        // ----------------------------------------------
        // DATA YANG DIKIRIM KE GOOGLE SHEETS
        // ----------------------------------------------

        const data = {
            nama: nama,
            whatsapp: whatsapp,
            merk: merk,
            nopol: nopol
        };


        console.log("Data yang akan dikirim:");
        console.log(data);


        // ----------------------------------------------
        // CARI TOMBOL SUBMIT
        // ----------------------------------------------

        const submitButton =
            form.querySelector('button[type="submit"]') ||
            form.querySelector('input[type="submit"]');


        // ----------------------------------------------
        // UBAH TOMBOL SAAT MENGIRIM
        // ----------------------------------------------

        let originalButtonText = "";

        if (submitButton) {

            originalButtonText =
                submitButton.textContent ||
                submitButton.value ||
                "";

            submitButton.disabled = true;

            if (submitButton.tagName === "INPUT") {
                submitButton.value = "Mengirim...";
            } else {
                submitButton.textContent = "Mengirim...";
            }
        }


        // ==================================================
        // KIRIM KE GOOGLE APPS SCRIPT
        // ==================================================

        try {

            console.log("Menghubungkan ke Google Apps Script...");


            const response = await fetch(SCRIPT_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify(data)

            });


            console.log("Status response:", response.status);


            // ------------------------------------------
            // AMBIL HASIL RESPONSE
            // ------------------------------------------

            const responseText = await response.text();

            console.log("Response dari server:");
            console.log(responseText);


            let result;

            try {

                result = JSON.parse(responseText);

            } catch (jsonError) {

                console.warn(
                    "Response bukan JSON:",
                    responseText
                );

                // Google Apps Script kadang memberikan
                // response redirect / text biasa.

                result = {
                    success: response.ok,
                    message: responseText
                };
            }


            // ==================================================
            // JIKA BERHASIL
            // ==================================================

            if (
                response.ok &&
                (
                    result.success === true ||
                    result.status === "success" ||
                    result.message === "Data berhasil disimpan"
                )
            ) {

                alert(
                    "PENDAFTARAN BERHASIL!\n\n" +
                    "Nama: " + nama + "\n" +
                    "WhatsApp: " + whatsapp + "\n" +
                    "Motor: " + merk + "\n" +
                    "No. Polisi: " + nopol
                );


                // Reset form

                form.reset();


                console.log(
                    "Data berhasil dikirim ke Google Sheets."
                );


            } else {

                console.error(
                    "Google Apps Script mengembalikan error:",
                    result
                );

                alert(
                    "Data gagal disimpan.\n\n" +
                    "Silakan coba lagi.\n\n" +
                    "Detail: " +
                    (
                        result.error ||
                        result.message ||
                        "Server tidak memberikan keterangan."
                    )
                );
            }


        } catch (error) {

            // ==================================================
            // ERROR KONEKSI
            // ==================================================

            console.error(
                "ERROR SAAT MENGIRIM DATA:",
                error
            );


            alert(
                "TIDAK DAPAT TERHUBUNG KE SERVER.\n\n" +
                "Periksa koneksi internet dan deployment Google Apps Script.\n\n" +
                "Error: " +
                error.message
            );

        }


        // ==================================================
        // KEMBALIKAN TOMBOL
        // ==================================================

        if (submitButton) {

            submitButton.disabled = false;

            if (submitButton.tagName === "INPUT") {
                submitButton.value = originalButtonText;
            } else {
                submitButton.textContent = originalButtonText;
            }
        }

    });

});
