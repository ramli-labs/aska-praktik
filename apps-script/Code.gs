/**
 * ASKA Praktik Informatika Kelas IX – SMP Labschool Jakarta – TA 2026/2027
 * Backend ujian praktik berbasis web (Google Sheet + Apps Script).
 *
 * File lain dalam proyek ini:
 *   Soal.gs     : generator soal (sama dengan soal.js di web latihan)
 *   Rahasia.gs  : const SALT (penentu angka 56 paket) – JANGAN dibagikan
 *   Murid.gs    : const MURID_RAW (daftar murid)
 *
 * Tab: Config, Murid, Sesi, Peserta, Jawaban, Pelanggaran, Nilai
 */

const KELAS = ['IX-A', 'IX-B', 'IX-C', 'IX-D', 'IX-E', 'IX-F', 'IX-G'];
const HDR = {
  Config: ['Kunci', 'Nilai', 'Keterangan'],
  Murid: ['Kelas', 'Absen', 'Nama'],
  Sesi: ['Kelas', 'Sesi', 'Token', 'Status', 'Dibuka', 'Ditutup'],
  Peserta: ['Kelas', 'Absen', 'Nama', 'Sesi', 'Baris', 'Kursi', 'Paket', 'Status', 'SID', 'Login ke', 'Mulai', 'Batas', 'Selesai', 'Pelanggaran', 'Terakhir aktif', 'Keterangan'],
  Jawaban: ['Kelas', 'Absen', 'Nama', 'Paket', 'Disimpan', 'Soal 1', 'Soal 2', 'Soal 3', 'Soal 4', 'Soal 5', 'Soal 6'],
  Pelanggaran: ['Waktu', 'Kelas', 'Absen', 'Nama', 'Jenis', 'Ke'],
  Nilai: ['Kelas', 'Absen', 'Nama', 'Paket', 'Skor 1', 'Skor 2', 'Skor 3', 'Skor 4', 'Skor 5', 'Skor 6', 'Nilai', 'Rincian', 'Dinilai'],
};
const P = { KELAS: 0, ABSEN: 1, NAMA: 2, SESI: 3, BARIS: 4, KURSI: 5, PAKET: 6, STATUS: 7, SID: 8, LOGIN: 9, MULAI: 10, BATAS: 11, SELESAI: 12, LANGGAR: 13, AKTIF: 14, KET: 15 };
const GRACE_MS = 2 * 60 * 1000;

/* ======================= SETUP ======================= */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(HDR).forEach(n => sheet_(ss, n));
  const cfg = ss.getSheetByName('Config');
  if (cfg.getLastRow() < 2) {
    cfg.getRange(2, 1, 3, 3).setValues([
      ['KUNCI_GURU', acak_(10, 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'), 'Untuk masuk panel guru. Jangan dibagikan ke murid.'],
      ['PIN_PENGAWAS', acak_(6, '0123456789'), 'Untuk murid yang perlu masuk ulang saat ujian.'],
      ['DURASI_MENIT', 60, 'Lama pengerjaan sejak murid menekan Mulai.'],
    ]);
    cfg.setColumnWidth(2, 160); cfg.setColumnWidth(3, 380);
  }
  const murid = ss.getSheetByName('Murid');
  if (murid.getLastRow() < 2 && typeof MURID_RAW !== 'undefined') {
    const rows = MURID_RAW.split(';').map(s => { const p = s.split('|'); return ['IX-' + p[0].charAt(0), Number(p[0].slice(1)), p[1]]; });
    murid.getRange(2, 1, rows.length, 3).setValues(rows);
  }
  const ps = ss.getSheetByName('Peserta');
  if (ps.getLastRow() < 2) {
    const m = murid.getDataRange().getValues().slice(1);
    const rows = m.map(r => { const k = ASKA.paketKursi(Number(r[1])); return [r[0], Number(r[1]), r[2], k.sesi, k.baris, k.kursi, k.paket, 'Belum', '', 0, '', '', '', 0, '', '']; });
    ps.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    ps.getRange('K:M').setNumberFormat('dd/MM/yyyy HH:mm:ss'); ps.getRange('O:O').setNumberFormat('dd/MM/yyyy HH:mm:ss'); ps.getRange('N:N').setNumberFormat('0');
  }
  const sesi = ss.getSheetByName('Sesi');
  if (sesi.getLastRow() < 2) {
    const rows = []; KELAS.forEach(k => [1, 2].forEach(s => rows.push([k, s, '', 'Ditutup', '', ''])));
    sesi.getRange(2, 1, rows.length, 6).setValues(rows);
    sesi.getRange('E:F').setNumberFormat('dd/MM/yyyy HH:mm');
  }
  ss.getSheetByName('Pelanggaran').getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  ss.getSheetByName('Jawaban').getRange('E:E').setNumberFormat('dd/MM/yyyy HH:mm:ss');
  ss.toast('Setup selesai. KUNCI_GURU dan PIN_PENGAWAS ada di tab Config.');
}

function sheet_(ss, n) {
  let sh = ss.getSheetByName(n);
  if (!sh) sh = ss.insertSheet(n);
  sh.getRange(1, 1, 1, HDR[n].length).setValues([HDR[n]]).setFontWeight('bold').setBackground('#d9d9d9');
  sh.setFrozenRows(1);
  return sh;
}
function acak_(n, abc) { let s = ''; for (let i = 0; i < n; i++) s += abc.charAt(Math.floor(Math.random() * abc.length)); return s; }

/* ======================= UTIL ======================= */
function cfg_() {
  const c = CacheService.getScriptCache().get('cfg'); if (c) return JSON.parse(c);
  const v = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Config').getDataRange().getValues().slice(1);
  const o = {}; v.forEach(r => o[r[0]] = String(r[1]));
  CacheService.getScriptCache().put('cfg', JSON.stringify(o), 300);
  return o;
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function sh_(n) { return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(n); }
function paketId_(kelas, sesi, paket) { return kelas + '-S' + sesi + '-' + paket; }
function paket_(id) { const p = id.split('-'); return ASKA.buatPaket(p[3], ASKA.seedDari(SALT + '|' + id)); }
function soalMurid_(id) {
  return paket_(id).map(q => ({ no: q.no, judul: q.judul, teks: q.teks, contoh: q.contoh || '', kode_awal: q.kode_awal || '', bobot: q.bobot, kesukaran: q.kesukaran }));
}
function cariPeserta_(pred) {
  const sh = sh_('Peserta'); const v = sh.getDataRange().getValues();
  for (let i = 1; i < v.length; i++) if (pred(v[i])) return { sh, row: i + 1, r: v[i] };
  return null;
}
function tulisPeserta_(f, upd) { Object.keys(upd).forEach(k => f.sh.getRange(f.row, P[k] + 1).setValue(upd[k])); }
function angka_(v) { return v instanceof Date ? 0 : Number(v || 0); }
function perbaikiFormatPeserta() {
  const sh = sh_('Peserta'); const n = sh.getLastRow() - 1; if (n < 1) return;
  sh.getRange('N:N').setNumberFormat('0'); sh.getRange('J:J').setNumberFormat('0');
  const v = sh.getRange(2, 14, n, 1).getValues().map(r => [r[0] instanceof Date ? 0 : Number(r[0] || 0)]);
  sh.getRange(2, 14, n, 1).setValues(v);
}
function waktu_(d) { return d instanceof Date ? d.getTime() : (d ? new Date(d).getTime() : 0); }
function simpanJawaban_(f, jawaban) {
  if (!jawaban) return;
  const sh = sh_('Jawaban'); const v = sh.getDataRange().getValues();
  let row = 0; for (let i = 1; i < v.length; i++) if (v[i][0] === f.r[P.KELAS] && Number(v[i][1]) === Number(f.r[P.ABSEN])) { row = i + 1; break; }
  const old = row ? v[row - 1].slice(5, 11) : ['', '', '', '', '', ''];
  const vals = [1, 2, 3, 4, 5, 6].map((n, i) => (jawaban[n] !== undefined && jawaban[n] !== null) ? String(jawaban[n]).slice(0, 20000) : old[i]);
  const data = [f.r[P.KELAS], f.r[P.ABSEN], f.r[P.NAMA], paketId_(f.r[P.KELAS], f.r[P.SESI], f.r[P.PAKET]), new Date()].concat(vals);
  if (row) sh.getRange(row, 1, 1, data.length).setValues([data]); else sh.appendRow(data);
}
function bacaJawaban_(kelas, absen) {
  const v = sh_('Jawaban').getDataRange().getValues();
  for (let i = 1; i < v.length; i++) if (v[i][0] === kelas && Number(v[i][1]) === Number(absen)) return { 1: v[i][5], 2: v[i][6], 3: v[i][7], 4: v[i][8], 5: v[i][9], 6: v[i][10] };
  return {};
}
function terisi_(j, pid) {
  const awal = String(paket_(pid)[5].kode_awal || '').trim();
  return j.slice(5, 11).filter((x, i) => String(x).trim() && !(i === 5 && String(x).trim() === awal)).length;
}
function selesai_(f, alasan) {
  tulisPeserta_(f, { STATUS: 'Selesai', SELESAI: new Date(), KET: alasan || '' });
}

/* ======================= WEB ======================= */
function doGet(e) {
  const p = e.parameter || {};
  try {
    if (p.aksi === 'murid') {
      if (KELAS.indexOf(p.kelas) < 0) return json_({ ok: false, pesan: 'Kelas tidak dikenal' });
      const v = sh_('Murid').getDataRange().getValues().slice(1).filter(r => r[0] === p.kelas).map(r => ({ absen: Number(r[1]), nama: String(r[2]) }));
      return json_({ ok: true, data: v.sort((a, b) => a.absen - b.absen) });
    }
    return json_({ ok: true, waktu: Date.now() });
  } catch (err) { return json_({ ok: false, pesan: String(err) }); }
}

function doPost(e) {
  let b; try { b = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, pesan: 'Format salah' }); }
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(25000);
    const fn = API_[b.aksi];
    if (!fn) return json_({ ok: false, pesan: 'Aksi tidak dikenal' });
    if (b.aksi.indexOf('guru') === 0 && String(b.kunci || '') !== cfg_().KUNCI_GURU) return json_({ ok: false, pesan: 'Kunci guru salah' });
    const out = fn(b); out.now = Date.now();
    return json_(out);
  } catch (err) {
    return json_({ ok: false, pesan: String(err && err.message || err) });
  } finally { try { lock.releaseLock(); } catch (e2) {} }
}

const API_ = {
  /* ---------- murid ---------- */
  login(b) {
    const absen = Number(b.absen);
    const f = cariPeserta_(r => r[P.KELAS] === b.kelas && Number(r[P.ABSEN]) === absen);
    if (!f) return { ok: false, pesan: 'Nama tidak terdaftar.' };
    const ses = sh_('Sesi').getDataRange().getValues().find(r => r[0] === b.kelas && Number(r[1]) === Number(f.r[P.SESI]));
    if (!ses || ses[3] !== 'Dibuka') return { ok: false, pesan: `Sesi ${f.r[P.SESI]} kelas ${b.kelas} belum dibuka pengawas.` };
    if (String(b.token || '').trim().toUpperCase() !== String(ses[2]).toUpperCase()) return { ok: false, pesan: 'Token salah. Periksa token dari pengawas.' };
    if (f.r[P.STATUS] === 'Selesai') return { ok: false, pesan: 'Ujianmu sudah selesai dan jawaban sudah terkirim.' };
    if (f.r[P.SID] && String(b.pin || '') !== cfg_().PIN_PENGAWAS) return { ok: false, perluPin: true, pesan: 'Kamu sudah pernah masuk. Minta pengawas memasukkan PIN.' };
    const sid = Utilities.getUuid();
    const status = f.r[P.STATUS] === 'Mengerjakan' ? 'Mengerjakan' : 'Login';
    tulisPeserta_(f, { SID: sid, LOGIN: angka_(f.r[P.LOGIN]) + 1, STATUS: status, AKTIF: new Date() });
    const pid = paketId_(f.r[P.KELAS], f.r[P.SESI], f.r[P.PAKET]);
    return {
      ok: true, sid, nama: f.r[P.NAMA], kelas: f.r[P.KELAS], absen, sesi: f.r[P.SESI], kursi: f.r[P.BARIS] + f.r[P.KURSI], paket: f.r[P.PAKET],
      soal: soalMurid_(pid), status, batas: waktu_(f.r[P.BATAS]), pelanggaran: angka_(f.r[P.LANGGAR]),
      jawaban: bacaJawaban_(f.r[P.KELAS], absen), durasi: Number(cfg_().DURASI_MENIT || 60),
    };
  },
  mulai(b) {
    const f = cariPeserta_(r => r[P.SID] && r[P.SID] === b.sid);
    if (!f) return { ok: false, keluar: true, pesan: 'Sesi masuk tidak berlaku (mungkin dipakai di komputer lain). Masuk ulang dengan PIN pengawas.' };
    if (f.r[P.STATUS] === 'Selesai') return { ok: false, selesai: true, pesan: 'Ujian sudah selesai.' };
    let batas = waktu_(f.r[P.BATAS]);
    if (!f.r[P.MULAI]) {
      const now = new Date(); batas = now.getTime() + Number(cfg_().DURASI_MENIT || 60) * 60000;
      tulisPeserta_(f, { MULAI: now, BATAS: new Date(batas), STATUS: 'Mengerjakan', AKTIF: now });
    } else tulisPeserta_(f, { STATUS: 'Mengerjakan', AKTIF: new Date() });
    return { ok: true, batas, pelanggaran: angka_(f.r[P.LANGGAR]) };
  },
  simpan(b) {
    const f = cariPeserta_(r => r[P.SID] && r[P.SID] === b.sid);
    if (!f) return { ok: false, keluar: true, pesan: 'Sesi masuk tidak berlaku. Masuk ulang dengan PIN pengawas.' };
    if (f.r[P.STATUS] === 'Selesai') return { ok: false, selesai: true, pesan: 'Ujian sudah selesai.' };
    const batas = waktu_(f.r[P.BATAS]);
    if (batas && Date.now() > batas + GRACE_MS) { selesai_(f, 'Waktu habis'); return { ok: false, selesai: true, pesan: 'Waktu habis.' }; }
    simpanJawaban_(f, b.jawaban);
    tulisPeserta_(f, { AKTIF: new Date() });
    return { ok: true, batas, pelanggaran: angka_(f.r[P.LANGGAR]) };
  },
  langgar(b) {
    const f = cariPeserta_(r => r[P.SID] && r[P.SID] === b.sid);
    if (!f) return { ok: false, keluar: true, pesan: 'Sesi masuk tidak berlaku.' };
    if (f.r[P.STATUS] === 'Selesai') return { ok: false, selesai: true, pesan: 'Ujian sudah selesai.' };
    simpanJawaban_(f, b.jawaban);
    const ke = angka_(f.r[P.LANGGAR]) + 1;
    sh_('Pelanggaran').appendRow([new Date(), f.r[P.KELAS], f.r[P.ABSEN], f.r[P.NAMA], String(b.jenis || '').slice(0, 80), ke]);
    tulisPeserta_(f, { LANGGAR: ke, AKTIF: new Date() });
    if (ke >= 3) { selesai_(f, 'Pelanggaran ke-3'); return { ok: true, pelanggaran: ke, selesai: true }; }
    return { ok: true, pelanggaran: ke, selesai: false };
  },
  kirim(b) {
    const f = cariPeserta_(r => r[P.SID] && r[P.SID] === b.sid);
    if (!f) return { ok: false, keluar: true, pesan: 'Sesi masuk tidak berlaku. Masuk ulang dengan PIN pengawas lalu kirim lagi.' };
    if (f.r[P.STATUS] !== 'Selesai') { simpanJawaban_(f, b.jawaban); selesai_(f, b.alasan || 'Dikirim murid'); }
    return { ok: true, selesai: true };
  },

  /* ---------- guru ---------- */
  guruStatus(b) {
    const ses = sh_('Sesi').getDataRange().getValues().find(r => r[0] === b.kelas && Number(r[1]) === Number(b.sesi));
    const v = sh_('Peserta').getDataRange().getValues().slice(1).filter(r => r[P.KELAS] === b.kelas && Number(r[P.SESI]) === Number(b.sesi));
    const jv = sh_('Jawaban').getDataRange().getValues().slice(1).filter(r => r[0] === b.kelas);
    const nv = sh_('Nilai').getDataRange().getValues().slice(1).filter(r => r[0] === b.kelas);
    const peserta = v.map(r => {
      const j = jv.find(x => Number(x[1]) === Number(r[P.ABSEN]));
      const n = nv.find(x => Number(x[1]) === Number(r[P.ABSEN]));
      return {
        absen: Number(r[P.ABSEN]), nama: r[P.NAMA], kursi: r[P.BARIS] + r[P.KURSI], paket: r[P.PAKET], status: r[P.STATUS], login: angka_(r[P.LOGIN]),
        mulai: waktu_(r[P.MULAI]), batas: waktu_(r[P.BATAS]), selesai: waktu_(r[P.SELESAI]), pelanggaran: angka_(r[P.LANGGAR]), aktif: waktu_(r[P.AKTIF]),
        ket: r[P.KET], disimpan: j ? waktu_(j[4]) : 0, terisi: j ? terisi_(j, paketId_(r[P.KELAS], r[P.SESI], r[P.PAKET])) : 0, nilai: n ? n[10] : '',
      };
    });
    return { ok: true, sesi: ses ? { token: ses[2], status: ses[3], dibuka: waktu_(ses[4]) } : null, pin: cfg_().PIN_PENGAWAS, durasi: Number(cfg_().DURASI_MENIT || 60), peserta };
  },
  guruBukaSesi(b) {
    const sh = sh_('Sesi'); const v = sh.getDataRange().getValues();
    for (let i = 1; i < v.length; i++) if (v[i][0] === b.kelas && Number(v[i][1]) === Number(b.sesi)) {
      const token = b.tokenBaru || !v[i][2] ? acak_(5, 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789') : v[i][2];
      sh.getRange(i + 1, 3, 1, 4).setValues([[token, 'Dibuka', new Date(), '']]);
      return { ok: true, token };
    }
    return { ok: false, pesan: 'Sesi tidak ditemukan' };
  },
  guruTutupSesi(b) {
    const sh = sh_('Sesi'); const v = sh.getDataRange().getValues();
    for (let i = 1; i < v.length; i++) if (v[i][0] === b.kelas && Number(v[i][1]) === Number(b.sesi)) { sh.getRange(i + 1, 4, 1, 3).setValues([['Ditutup', v[i][4], new Date()]]); return { ok: true }; }
    return { ok: false, pesan: 'Sesi tidak ditemukan' };
  },
  guruResetLogin(b) {
    const f = cariPeserta_(r => r[P.KELAS] === b.kelas && Number(r[P.ABSEN]) === Number(b.absen));
    if (!f) return { ok: false, pesan: 'Murid tidak ditemukan' };
    tulisPeserta_(f, { SID: '' });
    return { ok: true };
  },
  guruBukaLagi(b) {
    // membuka kembali ujian murid yang terlanjur selesai karena kendala teknis (bukan pelanggaran)
    const f = cariPeserta_(r => r[P.KELAS] === b.kelas && Number(r[P.ABSEN]) === Number(b.absen));
    if (!f) return { ok: false, pesan: 'Murid tidak ditemukan' };
    const tambah = Math.max(0, Number(b.tambahMenit || 0)) * 60000;
    const batasLama = waktu_(f.r[P.BATAS]);
    const batas = Math.max(batasLama || 0, Date.now()) + tambah;
    tulisPeserta_(f, { STATUS: f.r[P.MULAI] ? 'Mengerjakan' : 'Login', SID: '', SELESAI: '', BATAS: f.r[P.MULAI] ? new Date(batas) : '', KET: 'Dibuka lagi oleh guru' });
    return { ok: true };
  },
  guruDataNilai(b) {
    const v = sh_('Peserta').getDataRange().getValues().slice(1).filter(r => r[P.KELAS] === b.kelas && Number(r[P.SESI]) === Number(b.sesi));
    const out = v.map(r => {
      const pid = paketId_(r[P.KELAS], r[P.SESI], r[P.PAKET]);
      return { absen: Number(r[P.ABSEN]), nama: r[P.NAMA], paket: pid, status: r[P.STATUS], jawaban: bacaJawaban_(r[P.KELAS], r[P.ABSEN]), soal: paket_(pid) };
    });
    return { ok: true, data: out };
  },
  guruSimpanNilai(b) {
    const sh = sh_('Nilai'); const v = sh.getDataRange().getValues();
    (b.rows || []).forEach(x => {
      const data = [b.kelas, Number(x.absen), x.nama, x.paket].concat(x.skor.map(Number)).concat([Number(x.nilai), String(x.rincian || '').slice(0, 2000), new Date()]);
      let row = 0; for (let i = 1; i < v.length; i++) if (v[i][0] === b.kelas && Number(v[i][1]) === Number(x.absen)) { row = i + 1; break; }
      if (row) sh.getRange(row, 1, 1, data.length).setValues([data]); else { sh.appendRow(data); v.push(data); }
    });
    return { ok: true, jumlah: (b.rows || []).length };
  },
};
