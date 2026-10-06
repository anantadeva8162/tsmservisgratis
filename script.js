<script>


// =====================================================
// FORM
// =====================================================

const form =
    document.getElementById(
        'registrationForm'
    );


const submitBtn =
    document.getElementById(
        'submitBtn'
    );


const loading =
    document.getElementById(
        'loading'
    );


const success =
    document.getElementById(
        'success'
    );


const error =
    document.getElementById(
        'error'
    );



// =====================================================
// SUBMIT
// =====================================================

form.addEventListener(
    'submit',
    function(event) {

        event.preventDefault();


        // ---------------------------------------------
        // AMBIL DATA
        // ---------------------------------------------

        const whatsapp =
            document
                .getElementById('whatsapp')
                .value
                .trim();


        const nama =
            document
                .getElementById('nama')
                .value
                .trim();


        const motor =
            document
                .getElementById('motor')
                .value
                .trim();


        const polisi =
            document
                .getElementById('polisi')
                .value
                .trim()
                .toUpperCase();



        // ---------------------------------------------
        // RESET PESAN
        // ---------------------------------------------

        success.style.display =
            'none';

        error.style.display =
            'none';



        // ---------------------------------------------
        // VALIDASI
        // ---------------------------------------------

        if (
            !whatsapp ||
            !nama ||
            !motor ||
            !polisi
        ) {

            tampilkanError(
                'Semua kolom wajib diisi.'
            );

            return;

        }



        // ---------------------------------------------
        // VALIDASI WHATSAPP
        // ---------------------------------------------

        const nomor =
            whatsapp.replace(
                /\D/g,
                ''
            );


        if (nomor.length < 10) {

            tampilkanError(
                'Nomor WhatsApp tidak valid.'
            );

            return;

        }



        // ---------------------------------------------
        // TAMPILKAN LOADING
        // ---------------------------------------------

        loading.style.display =
            'block';


        submitBtn.disabled =
            true;


        submitBtn.innerHTML =
            'MENYIMPAN...';



        // ---------------------------------------------
        // DATA
        // ---------------------------------------------

        const data = {

            whatsapp:
                whatsapp,

            nama:
                nama,

            motor:
                motor,

            polisi:
                polisi

        };



        // ---------------------------------------------
        // KIRIM KE CODE.GS
        // ---------------------------------------------

        google.script.run

            .withSuccessHandler(
                function(response) {


                    loading.style.display =
                        'none';


                    submitBtn.disabled =
                        false;


                    submitBtn.innerHTML =
                        'DAFTAR SEKARANG →';



                    // ---------------------------------
                    // BERHASIL
                    // ---------------------------------

                    if (
                        response &&
                        response.success
                    ) {

                        success.innerHTML =
                            '✓ ' +
                            response.message;


                        success.style.display =
                            'block';


                        form.reset();


                        window.scrollTo({

                            top: 0,

                            behavior: 'smooth'

                        });


                    }

                    // ---------------------------------
                    // GAGAL
                    // ---------------------------------

                    else {

                        tampilkanError(

                            response
                                ? response.message
                                : 'Data gagal disimpan.'

                        );

                    }

                }
            )


            .withFailureHandler(
                function(err) {


                    loading.style.display =
                        'none';


                    submitBtn.disabled =
                        false;


                    submitBtn.innerHTML =
                        'DAFTAR SEKARANG →';


                    tampilkanError(
                        'Terjadi kesalahan saat mengirim data.'
                    );


                    console.error(err);

                }
            )


            .simpanData(data);

    }
);



// =====================================================
// ERROR
// =====================================================

function tampilkanError(pesan) {

    error.innerHTML =
        '⚠ ' + pesan;

    error.style.display =
        'block';

}



// =====================================================
// NOMOR POLISI OTOMATIS HURUF BESAR
// =====================================================

document
    .getElementById('polisi')
    .addEventListener(
        'input',
        function() {

            this.value =
                this.value.toUpperCase();

        }
    );



// =====================================================
// NOMOR WHATSAPP
// Hanya angka, spasi, +, -, (, )
// =====================================================

document
    .getElementById('whatsapp')
    .addEventListener(
        'input',
        function() {

            this.value =
                this.value.replace(
                    /[^0-9+\-\s()]/g,
                    ''
                );

        }
    );


</script>
