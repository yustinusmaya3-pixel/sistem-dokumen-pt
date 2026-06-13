// ==========================
// SUPABASE CONFIG
// ==========================

const SUPABASE_URL =
"https://vltxxwrduxpvaktovzen.supabase.co";

const SUPABASE_KEY =
"sb_publishable_iL9PorzJ7Rg73mktCGFpsg_I6xV-_p2";

const supabaseClient =
supabase.createClient(
SUPABASE_URL,
SUPABASE_KEY
);

// ==========================
// LOGIN ADMIN
// ==========================

function loginAdmin(){

const username =
document.getElementById("username")?.value;

const password =
document.getElementById("password")?.value;

if(
username==="admin" &&
password==="admin123"
){

localStorage.setItem(
"adminLogin",
"true"
);

window.location.href =
"index.html";

}else{

const err =
document.getElementById("errorLogin");

if(err){

err.innerText =
"Username atau Password salah";

}

}

}

// ==========================
// CEK LOGIN
// ==========================

if(
window.location.pathname.includes("index.html")
){

const login =
localStorage.getItem(
"adminLogin"
);

if(login!=="true"){

window.location.href =
"login.html";

}

}

// ==========================
// LOGOUT
// ==========================

function logoutAdmin(){

localStorage.removeItem(
"adminLogin"
);

window.location.href =
"login.html";

}

// ==========================
// TANGGAL MASUK OTOMATIS
// ==========================

window.onload = () => {

const tanggalMasuk =
document.getElementById(
"tanggalMasuk"
);

if(tanggalMasuk){

const today =
new Date();

tanggalMasuk.value =
today.toISOString()
.split("T")[0];

}

loadData();

};

// ==========================
// NOMOR DOKUMEN
// ==========================

function generateNomor(){

return "DOC-" +
Date.now();

}

// ==========================
// FORMAT RUPIAH
// ==========================

function formatRupiah(nilai){

return new Intl.NumberFormat(
"id-ID",
{
style:"currency",
currency:"IDR"
}
).format(nilai);

}

// ==========================
// SIMPAN DOKUMEN
// ==========================

async function tambahDokumen(){

const tanggalMasuk =
document.getElementById(
"tanggalMasuk"
).value;

const lokasi =
document.getElementById(
"lokasi"
).value;

const departemen =
document.getElementById(
"departemen"
).value;

const diajukan =
document.getElementById(
"diajukan"
).value;

const tanggalDokumen =
document.getElementById(
"tanggalDokumen"
).value;

const keperluan =
document.getElementById(
"keperluan"
).value;

const nominal =
document.getElementById(
"nominal"
).value;

if(
!lokasi ||
!departemen ||
!diajukan ||
!keperluan
){

alert(
"Lengkapi semua data"
);

return;

}

const nomorDokumen =
generateNomor();

const { error } =
await supabaseClient
.from("dokumen")
.insert([
{
nomor_dokumen:
nomorDokumen,

tanggal_masuk:
tanggalMasuk,

lokasi:
lokasi,

departemen:
departemen,

diajukan:
diajukan,

tanggal_dokumen:
tanggalDokumen,

keperluan:
keperluan,

nominal:
Number(nominal)
}
]);

if(error){

alert(
"Gagal simpan : "
+ error.message
);

return;

}

document.getElementById(
"pesanSukses"
).style.display="block";

document.querySelectorAll(
"input"
).forEach(
input=>{

if(
input.id!=="tanggalMasuk"
){
input.value="";
}

}
);

setTimeout(()=>{

document.getElementById(
"pesanSukses"
).style.display="none";

},3000);

}

// ==========================
// LOAD DATA
// ==========================

async function loadData(){

const tbody =
document.getElementById(
"dataDokumen"
);

if(!tbody) return;

const { data,error } =
await supabaseClient
.from("dokumen")
.select("*")
.order("id",
{
ascending:false
});

if(error){

console.log(error);

return;

}

tbody.innerHTML="";

document.getElementById(
"totalDokumen"
).innerText =
data.length;

data.forEach(
(item,index)=>{

tbody.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${item.nomor_dokumen}</td>

<td>${item.tanggal_masuk}</td>

<td>${item.lokasi}</td>

<td>${item.departemen}</td>

<td>${item.diajukan}</td>

<td>${item.tanggal_dokumen}</td>

<td>${item.keperluan}</td>

<td>${formatRupiah(item.nominal)}</td>

<td>

<button
class="button-danger"
onclick="hapusData(${item.id})">

Hapus

</button>

</td>

</tr>

`;

}
);

}

// ==========================
// HAPUS DATA
// ==========================

async function hapusData(id){

if(
!confirm(
"Yakin hapus data?"
)
) return;

const { error } =
await supabaseClient
.from("dokumen")
.delete()
.eq("id",id);

if(error){

alert(
"Gagal hapus"
);

return;

}

loadData();

}

// ==========================
// FILTER
// ==========================

function filterData(){

let lokasi =
document
.getElementById(
"cariLokasi"
)
.value
.toUpperCase();

let departemen =
document
.getElementById(
"cariDepartemen"
)
.value
.toUpperCase();

let keperluan =
document
.getElementById(
"cariKeperluan"
)
.value
.toUpperCase();

let table =
document.querySelector(
"table"
);

let tr =
table.getElementsByTagName(
"tr"
);

for(let i=1;i<tr.length;i++){

let tdLokasi =
tr[i].getElementsByTagName(
"td"
)[3];

let tdDept =
tr[i].getElementsByTagName(
"td"
)[4];

let tdKeperluan =
tr[i].getElementsByTagName(
"td"
)[7];

if(
tdLokasi &&
tdDept &&
tdKeperluan
){

let cocok =

tdLokasi.innerText
.toUpperCase()
.includes(lokasi)

&&

tdDept.innerText
.toUpperCase()
.includes(departemen)

&&

tdKeperluan.innerText
.toUpperCase()
.includes(keperluan);

tr[i].style.display =
cocok ? "" : "none";

}

}

}

// ==========================
// CETAK PDF
// ==========================

function cetakPDF(){

const { jsPDF } =
window.jspdf;

const doc =
new jsPDF();

doc.setFontSize(16);

doc.text(
"Laporan Dokumen PT",
14,
15
);

let rows = [];

document
.querySelectorAll(
"#dataDokumen tr"
)
.forEach(
row=>{

let data=[];

row
.querySelectorAll(
"td"
)
.forEach(
cell=>{

data.push(
cell.innerText
);

}
);

rows.push(data);

}
);

doc.autoTable({

head:[[
"No",
"No Dokumen",
"Tgl Masuk",
"Lokasi",
"Departemen",
"Diajukan",
"Tgl Dokumen",
"Keperluan",
"Nominal"
]],

body:rows.map(
r=>r.slice(0,9)
)

});

doc.save(
"laporan-dokumen.pdf"
);

}