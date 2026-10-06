const SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbwrhhS7VFrOi__IJ9B7ADVOjv2_1me8pzOuMWoCM7xzF70d2YyseNo0hHiMiO6tn-me/exec";


document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formPendaftaran");

    if (!form) {
        console.error("Form pendaftaran tidak ditemukan.");
        return;
    }


    form.addEventListener("submit", function (e) {

        e.preventDefault();


        const nama =
            document.getElementById("nama").value.trim();

        const whatsapp =
            document.getElementById("whatsapp").value.trim();

        const merk =
            document.getElementById("merk").value.trim();

        const nopol =
            document.getElementById("nopol").value.trim().toUpperCase();


        // VALIDASI

        if (!whatsapp) {
            alert("Nomor WhatsApp wajib diisi.");
            return;
        }

        if (!nama) {
            alert("Nama wajib diisi.");
            return;
        }

        if (!merk) {
            alert("Merk / tipe sepeda motor wajib diisi.");
            return;
        }

        if (!nopol) {
            alert("Nomor polisi wajib diisi.");
            return;
        }


        // BUAT IFRAME TERSEMBUNYI

        let iframe =
            document.getElementById("googleSubmitFrame");

        if (!iframe) {

            iframe = document.createElement("iframe");

            iframe.id = "googleSubmitFrame";
            iframe.name = "googleSubmitFrame";

            iframe.style.display = "none";

            document.body.appendChild(iframe);
        }


        // BUAT FORM UNTUK GOOGLE APPS SCRIPT

        const googleForm =
            document.createElement("form");

        googleForm.method = "POST";
        googleForm.action = SCRIPT_URL;
        googleForm.target = "googleSubmitFrame";
        googleForm.style.display = "none";


        // DATA NAMA

        const namaInput =
            document.createElement("input");

        namaInput.type = "hidden";
        namaInput.name = "nama";
        namaInput.value = nama;

        googleForm.appendChild(namaInput);


        // DATA WHATSAPP

        const whatsappInput =
            document.createElement("input");

        whatsappInput.type = "hidden";
        whatsappInput.name = "whatsapp";
        whatsappInput.value = whatsapp;

        googleForm.appendChild(whatsappInput);


        // DATA MERK

        const merkInput =
            document.createElement("input");

        merkInput.type = "hidden";
        merkInput.name = "merk";
        merkInput.value = merk;

        googleForm.appendChild(merkInput);


        // DATA NOPOL

        const nopolInput =
            document.createElement("input");

        nopolInput.type = "hidden";
        nopolInput.name = "nopol";
        nopolInput.value = nopol;

        googleForm.appendChild(nopolInput);


        document.body.appendChild(googleForm);


        // TOMBOL

        const button =
            document.getElementById("submitButton");

        if (button) {

            button.disabled = true;

            button.dataset.oldText =
                button.innerHTML;

            button.innerHTML =
                "MENGIRIM...";

        }


        // KIRIM

        googleForm.submit();


        // TUNGGU PROSES

        setTimeout(function () {

            alert(
                "PENDAFTARAN BERHASIL!\n\n" +
                "Nama: " + nama + "\n" +
                "WhatsApp: " + whatsapp + "\n" +
                "Motor: " + merk + "\n" +
                "No. Polisi: " + nopol
            );


            // RESET FORM

            form.reset();


            // KEMBALIKAN TOMBOL

            if (button) {

                button.disabled = false;

                button.innerHTML =
                    button.dataset.oldText;
            }


            googleForm.remove();

        }, 2000);

    });

});
