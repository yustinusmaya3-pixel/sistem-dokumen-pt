// =========================
// SISTEM DOKUMEN PT
// =========================

let dokumen =
JSON.parse(localStorage.getItem("dokumen")) || [];

// Jalankan otomatis
setTanggalHariIni();
tampilkanDashboard();

// =========================
// TANGGAL HARI INI OTOMATIS
// =========================

function setTanggalHariIni(){

const input =
document.getElementById("tanggalMasuk");

if(!input) return;

const today = new Date();

const yyyy = today.getFullYear();

const mm =
String(today.getMonth()+1)
.padStart(2,"0");

const dd =
String(today.getDate())
.padStart(2,"0");

input.value =
`${yyyy}-${mm}-${dd}`;

}

// =========================
// NOMOR DOKUMEN OTOMATIS
// =========================

function generateNomorDokumen(){

const tahun =
new Date().getFullYear();

const nomor =
String(dokumen.length + 1)
.padStart(4,"0");

return `DOC-${tahun}-${nomor}`;

}

// =========================
// FORMAT RUPIAH
// =========================

function formatRupiah(angka){

return "Rp " +
Number(angka)
.toLocaleString("id-ID");

}

// =========================
// SIMPAN DOKUMEN
// =========================

function tambahDokumen(){

const tanggalMasuk =
document.getElementById("tanggalMasuk").value;

const departemen =
document.getElementById("departemen").value.trim();

const diajukan =
document.getElementById("diajukan").value.trim();

const tanggalDokumen =
document.getElementById("tanggalDokumen").value;

const keperluan =
document.getElementById("keperluan").value.trim();

const nominal =
document.getElementById("nominal").value;

if(
!departemen ||
!diajukan ||
!tanggalDokumen ||
!keperluan ||
!nominal
){

alert(
"Lengkapi semua data terlebih dahulu"
);

return;

}

const dataBaru = {

nomorDokumen:
generateNomorDokumen(),

tanggalMasuk,
departemen,
diajukan,
tanggalDokumen,
keperluan,
nominal

};

dokumen.push(dataBaru);

localStorage.setItem(
"dokumen",
JSON.stringify(dokumen)
);

// =========================
// TAMPILKAN PESAN SUKSES
// =========================

const pesan =
document.getElementById("pesanSukses");

if(pesan){

pesan.style.display = "block";

window.scrollTo({
top:0,
behavior:"smooth"
});

setTimeout(()=>{

pesan.style.display = "none";

},4000);

}

// =========================
// RESET FORM
// =========================

document.getElementById("departemen").value = "";

document.getElementById("diajukan").value = "";

document.getElementById("tanggalDokumen").value = "";

document.getElementById("keperluan").value = "";

document.getElementById("nominal").value = "";

setTanggalHariIni();

}

// =========================
// DASHBOARD
// =========================

function tampilkanDashboard(
data = dokumen
){

const tabel =
document.getElementById("dataDokumen");

const total =
document.getElementById("totalDokumen");

if(total){

total.innerText =
dokumen.length;

}

if(!tabel) return;

tabel.innerHTML = "";

if(data.length === 0){

tabel.innerHTML = `
<tr>
<td colspan="9"
style="text-align:center;">
Belum ada data
</td>
</tr>
`;

return;

}

data.forEach((item,index)=>{

tabel.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${item.nomorDokumen}</td>

<td>${item.tanggalMasuk}</td>

<td>${item.departemen}</td>

<td>${item.diajukan}</td>

<td>${item.tanggalDokumen}</td>

<td>${item.keperluan}</td>

<td>${formatRupiah(item.nominal)}</td>

<td>

<button
onclick="hapusData(${index})">

Hapus

</button>

</td>

</tr>

`;

});

}

// =========================
// HAPUS DATA
// =========================

function hapusData(index){

const konfirmasi =
confirm(
"Yakin ingin menghapus data?"
);

if(!konfirmasi) return;

dokumen.splice(index,1);

localStorage.setItem(
"dokumen",
JSON.stringify(dokumen)
);

tampilkanDashboard();

}

// =========================
// FILTER DATA
// =========================

function filterData(){

const departemen =
document
.getElementById(
"cariDepartemen"
)
.value
.toLowerCase();

const keperluan =
document
.getElementById(
"cariKeperluan"
)
.value
.toLowerCase();

const hasil =
dokumen.filter(item =>

item.departemen
.toLowerCase()
.includes(departemen)

&&

item.keperluan
.toLowerCase()
.includes(keperluan)

);

tampilkanDashboard(
hasil
);

}

// =========================
// CETAK PDF
// =========================

function cetakPDF(){

if(dokumen.length === 0){

alert(
"Tidak ada data untuk dicetak"
);

return;

}

const { jsPDF } =
window.jspdf;

const doc =
new jsPDF(
"landscape"
);

doc.setFontSize(16);

doc.text(
"SISTEM DOKUMEN PT",
14,
15
);

doc.setFontSize(10);

doc.text(
"Data Dokumen Perusahaan",
14,
22
);

doc.autoTable({

startY:30,

head:[[
"No",
"No Dokumen",
"Tgl Masuk",
"Departemen",
"Diajukan",
"Tgl Dokumen",
"Keperluan",
"Nominal"
]],

body:

dokumen.map(
(item,index)=>[
index+1,
item.nomorDokumen,
item.tanggalMasuk,
item.departemen,
item.diajukan,
item.tanggalDokumen,
item.keperluan,
formatRupiah(
item.nominal
)
]
),

styles:{
fontSize:8
},

headStyles:{
fillColor:[0,51,102]
}

});

doc.save(
"Laporan-Dokumen-PT.pdf"
);

}