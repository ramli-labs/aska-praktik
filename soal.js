/* Generator soal latihan ASKA Praktik Informatika IX (sejenis dengan ujian, angka acak). */
(function (G) {
  function RNG(seed) {
    let s = seed >>> 0 || 1;
    const next = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
    for (let i = 0; i < 8; i++) next();
    return {
      next,
      randint: (a, b) => a + Math.floor(next() * (b - a + 1)),
      choice: (arr) => arr[Math.floor(next() * arr.length)],
      sample(arr, k) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k); },
      randrange: (n) => Math.floor(next() * n),
    };
  }
  const rp = (n) => { n = Math.round(n * 100) / 100; return Number.isInteger(n) ? n.toLocaleString('id-ID').replace(/,/g, '.') : String(n).replace('.', ','); };
  const r2 = (x) => Math.round(x * 100) / 100;
  const pyround2 = (x) => { // round(x,2) Python (banker's pada nilai tepat .5 jarang terjadi; cukup)
    return Math.round((x + Number.EPSILON) * 100) / 100;
  };

  // ---------- SOAL 1: persen ----------
  function s1(P, r) {
    if (P === 'A') {
      const nom = r.choice([25000, 50000, 75000, 100000, 150000]), pj = r.choice([10, 11, 12]);
      const tes = [[nom, pj], [r.choice([20000, 40000, 60000]), r.choice([10, 11, 12])], [r.choice([80000, 120000, 200000]), r.choice([5, 8, 10])]];
      return {
        judul: 'Pulsa + Pajak',
        teks: 'Hitung total bayar pembelian pulsa setelah dikenai pajak.\nInput: nominal pulsa (bilangan bulat), lalu persen pajak (bilangan bulat).\nProses: pajak = nominal × persen pajak ÷ 100, lalu total = nominal + pajak.\nOutput: tampilkan pajak (dalam rupiah) dan total bayar.',
        contoh: `Input: ${nom} dan ${pj}  →  Pajak = ${rp(nom * pj / 100)}, Total bayar = ${rp(nom + nom * pj / 100)}`,
        ref: 'nominal = int(input())\npajak = int(input())\npajak_rp = nominal * pajak / 100\ntotal = nominal + pajak_rp\nprint("Pajak:", pajak_rp)\nprint("Total bayar:", total)',
        tes: tes.map(t => ({ input: t, harap: [t[0] * t[1] / 100, t[0] + t[0] * t[1] / 100] })),
      };
    }
    if (P === 'B') {
      const h = r.choice([12000, 15000, 18000, 25000]), j = r.choice([3, 4, 5, 6]), d = r.choice([10, 15, 20, 25]);
      const tes = [[h, j, d], [r.choice([8000, 20000]), r.choice([2, 7]), r.choice([5, 10])], [r.choice([30000, 45000]), r.choice([1, 3]), r.choice([20, 30])]];
      return {
        judul: 'Belanja + Diskon',
        teks: 'Hitung total belanja di koperasi sekolah setelah mendapat diskon.\nInput: harga satuan, jumlah barang, lalu persen diskon (semua bilangan bulat).\nProses: subtotal = harga × jumlah, potongan = subtotal × diskon ÷ 100, total = subtotal − potongan.\nOutput: tampilkan subtotal, potongan, dan total bayar.',
        contoh: `Input: ${h}, ${j}, ${d}  →  Subtotal = ${rp(h * j)}, Potongan = ${rp(h * j * d / 100)}, Total bayar = ${rp(h * j - h * j * d / 100)}`,
        ref: 'harga = int(input())\njumlah = int(input())\ndiskon = int(input())\nsubtotal = harga * jumlah\npotongan = subtotal * diskon / 100\ntotal = subtotal - potongan\nprint("Subtotal:", subtotal)\nprint("Potongan:", potongan)\nprint("Total bayar:", total)',
        tes: tes.map(t => ({ input: t, harap: [t[0] * t[1], t[0] * t[1] * t[2] / 100, t[0] * t[1] - t[0] * t[1] * t[2] / 100] })),
      };
    }
    if (P === 'C') {
      const h = r.choice([35000, 40000, 45000, 50000]), j = r.choice([2, 3, 4, 5]), l = r.choice([5, 10]);
      const tes = [[h, j, l], [r.choice([30000, 55000]), r.choice([1, 6]), r.choice([5, 10])], [r.choice([60000, 75000]), r.choice([2, 4]), r.choice([8, 12])]];
      return {
        judul: 'Tiket Bioskop + Biaya Layanan',
        teks: 'Hitung total bayar pemesanan tiket bioskop secara daring.\nInput: harga tiket, jumlah tiket, lalu persen biaya layanan (semua bilangan bulat).\nProses: subtotal = harga × jumlah, layanan = subtotal × persen ÷ 100, total = subtotal + layanan.\nOutput: tampilkan subtotal, biaya layanan, dan total bayar.',
        contoh: `Input: ${h}, ${j}, ${l}  →  Subtotal = ${rp(h * j)}, Biaya layanan = ${rp(h * j * l / 100)}, Total bayar = ${rp(h * j + h * j * l / 100)}`,
        ref: 'harga = int(input())\njumlah = int(input())\npersen = int(input())\nsubtotal = harga * jumlah\nlayanan = subtotal * persen / 100\ntotal = subtotal + layanan\nprint("Subtotal:", subtotal)\nprint("Biaya layanan:", layanan)\nprint("Total bayar:", total)',
        tes: tes.map(t => ({ input: t, harap: [t[0] * t[1], t[0] * t[1] * t[2] / 100, t[0] * t[1] + t[0] * t[1] * t[2] / 100] })),
      };
    }
    const b = r.choice([2, 3, 4, 5]), t_ = r.choice([9000, 10000, 12000]), a = r.choice([2, 5]);
    const tes = [[b, t_, a], [r.choice([1, 6]), r.choice([8000, 15000]), r.choice([1, 3])], [r.choice([7, 10]), r.choice([11000, 13000]), r.choice([2, 4])]];
    return {
      judul: 'Ongkos Kirim + Asuransi',
      teks: 'Hitung biaya pengiriman paket.\nInput: berat paket (kg), tarif per kg, lalu persen asuransi (semua bilangan bulat).\nProses: ongkir = berat × tarif, asuransi = ongkir × persen ÷ 100, total = ongkir + asuransi.\nOutput: tampilkan ongkir, asuransi, dan total biaya.',
      contoh: `Input: ${b}, ${t_}, ${a}  →  Ongkir = ${rp(b * t_)}, Asuransi = ${rp(b * t_ * a / 100)}, Total biaya = ${rp(b * t_ + b * t_ * a / 100)}`,
      ref: 'berat = int(input())\ntarif = int(input())\npersen = int(input())\nongkir = berat * tarif\nasuransi = ongkir * persen / 100\ntotal = ongkir + asuransi\nprint("Ongkir:", ongkir)\nprint("Asuransi:", asuransi)\nprint("Total biaya:", total)',
      tes: tes.map(t => ({ input: t, harap: [t[0] * t[1], t[0] * t[1] * t[2] / 100, t[0] * t[1] + t[0] * t[1] * t[2] / 100] })),
    };
  }

  // ---------- SOAL 2: // dan % ----------
  function s2(P, r) {
    if (P === 'A') {
      const m = r.randint(13, 30) * 10 + r.choice([0, 5]); const tes = [m, r.randint(40, 125), r.randint(300, 500)];
      return {
        judul: 'Menit → Jam dan Menit',
        teks: 'Ubah lama perjalanan dalam menit menjadi jam dan sisa menit.\nInput: total menit (bilangan bulat).\nProses: jam = menit // 60, sisa = menit % 60.\nOutput: tampilkan jam dan sisa menit.',
        contoh: `Input: ${m}  →  ${Math.floor(m / 60)} jam ${m % 60} menit`,
        ref: 'menit = int(input())\njam = menit // 60\nsisa = menit % 60\nprint(jam, "jam", sisa, "menit")',
        tes: tes.map(x => ({ input: [x], harap: [Math.floor(x / 60), x % 60] })),
      };
    }
    if (P === 'B') {
      const k = r.choice([6, 8, 10, 12, 15]), n = r.randint(50, 140); const tes = [n, r.randint(k + 1, 70), r.randint(141, 250)];
      return {
        judul: 'Telur ke Dalam Kotak',
        teks: `Peternak memasukkan telur ke kotak. Satu kotak berisi ${k} butir.\nInput: jumlah telur (bilangan bulat).\nProses: kotak = telur // ${k}, sisa = telur % ${k}.\nOutput: tampilkan jumlah kotak penuh dan sisa telur.`,
        contoh: `Input: ${n}  →  ${Math.floor(n / k)} kotak penuh, sisa ${n % k} butir`,
        ref: `telur = int(input())\nkotak = telur // ${k}\nsisa = telur % ${k}\nprint(kotak, "kotak penuh, sisa", sisa, "butir")`,
        tes: tes.map(x => ({ input: [x], harap: [Math.floor(x / k), x % k] })),
      };
    }
    if (P === 'C') {
      const d = r.choice([2000, 5000, 10000, 20000]), u = r.randint(40, 220) * 1000 + r.choice([0, 500]);
      const tes = [u, r.randint(10, 99) * 500, r.randint(230, 400) * 1000];
      return {
        judul: 'Uang ke Lembaran',
        teks: `Ubah sejumlah uang menjadi lembaran Rp${rp(d)} dan sisanya.\nInput: jumlah uang (bilangan bulat).\nProses: lembar = uang // ${d}, sisa = uang % ${d}.\nOutput: tampilkan jumlah lembar dan sisa uang.`,
        contoh: `Input: ${u}  →  ${Math.floor(u / d)} lembar, sisa Rp${rp(u % d)}`,
        ref: `uang = int(input())\nlembar = uang // ${d}\nsisa = uang % ${d}\nprint(lembar, "lembar, sisa", sisa)`,
        tes: tes.map(x => ({ input: [x], harap: [Math.floor(x / d), x % d] })),
      };
    }
    const h = r.randint(25, 110); const tes = [h, r.randint(6, 24), r.randint(111, 200)];
    return {
      judul: 'Hari → Minggu dan Hari',
      teks: 'Ubah lama liburan dalam hari menjadi minggu dan sisa hari.\nInput: jumlah hari (bilangan bulat).\nProses: minggu = hari // 7, sisa = hari % 7.\nOutput: tampilkan jumlah minggu dan sisa hari.',
      contoh: `Input: ${h}  →  ${Math.floor(h / 7)} minggu ${h % 7} hari`,
      ref: 'hari = int(input())\nminggu = hari // 7\nsisa = hari % 7\nprint(minggu, "minggu", sisa, "hari")',
      tes: tes.map(x => ({ input: [x], harap: [Math.floor(x / 7), x % 7] })),
    };
  }

  // ---------- SOAL 3: 2 kondisi ----------
  function s3(P, r) {
    if (P === 'A') {
      const k = r.choice([3, 4, 6, 7, 8, 9, 11]); const tes = [k * r.randint(3, 12), k * r.randint(3, 12) + r.randint(1, k - 1), k * r.randint(13, 20)];
      return {
        judul: `Cek Kelipatan ${k}`,
        teks: `Periksa apakah sebuah bilangan merupakan kelipatan ${k}.\nInput: bilangan bulat x.\nProses: jika x % ${k} == 0 tampilkan "Kelipatan ${k}", jika tidak tampilkan "Bukan kelipatan ${k}".\nOutput: Kelipatan ${k} / Bukan kelipatan ${k}.`,
        contoh: `Input: ${tes[0]}  →  Kelipatan ${k}      Input: ${tes[1]}  →  Bukan kelipatan ${k}`,
        ref: `x = int(input())\nif x % ${k} == 0:\n    print("Kelipatan ${k}")\nelse:\n    print("Bukan kelipatan ${k}")`,
        tes: tes.map(x => x % k === 0 ? { input: [x], harap_teks: 'Kelipatan', tolak: 'Bukan' } : { input: [x], harap_teks: 'Bukan' }),
      };
    }
    if (P === 'B') {
      const kk = r.choice([70, 72, 75, 76, 78, 80]); const tes = [kk, kk - r.randint(1, 4), r.randint(kk + 5, 100)];
      return {
        judul: 'Cek Tuntas',
        teks: `Tentukan apakah murid tuntas. Batas tuntas (KKTP) adalah ${kk}.\nInput: nilai (bilangan bulat 0–100).\nProses: jika nilai >= ${kk} tampilkan "Tuntas", jika tidak tampilkan "Belum tuntas".\nOutput: Tuntas / Belum tuntas.`,
        contoh: `Input: ${kk}  →  Tuntas      Input: ${tes[1]}  →  Belum tuntas`,
        ref: `nilai = int(input())\nif nilai >= ${kk}:\n    print("Tuntas")\nelse:\n    print("Belum tuntas")`,
        tes: tes.map(x => x >= kk ? { input: [x], harap_teks: 'Tuntas', tolak: 'Belum' } : { input: [x], harap_teks: 'Belum' }),
      };
    }
    if (P === 'C') {
      const b = r.choice([115, 120, 122, 125, 128, 130, 135, 140]); const tes = [b, b - r.randint(1, 5), r.randint(b + 8, 170)];
      return {
        judul: 'Cek Tinggi Wahana',
        teks: `Wahana permainan hanya boleh dinaiki pengunjung dengan tinggi badan minimal ${b} cm.\nInput: tinggi badan (cm, bilangan bulat).\nProses: jika tinggi >= ${b} tampilkan "Boleh naik", jika tidak tampilkan "Belum boleh naik".\nOutput: Boleh naik / Belum boleh naik.`,
        contoh: `Input: ${b}  →  Boleh naik      Input: ${tes[1]}  →  Belum boleh naik`,
        ref: `tinggi = int(input())\nif tinggi >= ${b}:\n    print("Boleh naik")\nelse:\n    print("Belum boleh naik")`,
        tes: tes.map(x => x >= b ? { input: [x], harap_teks: 'Boleh', tolak: 'Belum' } : { input: [x], harap_teks: 'Belum' }),
      };
    }
    const t_ = r.choice([3500, 4000, 4500, 5000, 5500, 6000]); const tes = [t_, t_ - 500 * r.randint(1, 3), r.randint(8, 40) * 500];
    return {
      judul: 'Cek Saldo Kartu',
      teks: `Tarif sekali naik bus adalah Rp${rp(t_)}. Periksa apakah saldo kartu cukup.\nInput: saldo (bilangan bulat).\nProses: jika saldo >= ${t_} tampilkan "Saldo cukup", jika tidak tampilkan "Saldo kurang".\nOutput: Saldo cukup / Saldo kurang.`,
      contoh: `Input: ${t_}  →  Saldo cukup      Input: ${tes[1]}  →  Saldo kurang`,
      ref: `saldo = int(input())\nif saldo >= ${t_}:\n    print("Saldo cukup")\nelse:\n    print("Saldo kurang")`,
      tes: tes.map(x => ({ input: [x], harap_teks: x >= t_ ? 'cukup' : 'kurang' })),
    };
  }

  // ---------- SOAL 4: 5 kondisi ----------
  function s4(P, r) {
    let bnd, lab, sat, judul, nama, ket;
    if (P === 'A') {
      const a = r.choice([0, 2, 4, 5, 6]), g = r.sample([10, 12, 14, 15], 3);
      bnd = [a, a + g[0], a + g[0] + g[1], a + g[0] + g[1] + g[2] - r.choice([2, 4, 6])];
      lab = ['Sangat Dingin', 'Dingin', 'Sejuk', 'Hangat', 'Panas']; sat = '°C'; judul = 'Kategori Suhu'; nama = 'suhu'; ket = 'suhu ruangan (°C, bilangan bulat)';
    } else if (P === 'B') {
      const s = r.choice([0, 1, 2, 3, 4, 5]), w = r.choice([8, 9, 10]);
      bnd = [92 + s - 4 * w + (w - 8), 92 + s - 3 * w, 92 + s - 2 * w, 92 + s - w];
      lab = ['E', 'D', 'C', 'B', 'A']; sat = ''; judul = 'Predikat Nilai'; nama = 'nilai'; ket = 'nilai (bilangan bulat 0–100)';
    } else if (P === 'C') {
      const s = r.choice([0, 5, 10, 15]), w = r.choice([15, 20, 25]);
      bnd = [20 + s, 20 + s + w, 20 + s + 2 * w, 20 + s + 3 * w];
      lab = ['Sangat Lambat', 'Lambat', 'Sedang', 'Cepat', 'Melanggar Batas']; sat = ' km/jam'; judul = 'Kategori Kecepatan'; nama = 'kecepatan'; ket = 'kecepatan kendaraan (km/jam, bilangan bulat)';
    } else {
      const s = r.choice([0, 500, 1000, 1500, 2000]), w = r.choice([2500, 3000, 3500]);
      bnd = [3000 + s, 3000 + s + w, 3000 + s + 2 * w, 3000 + s + 3 * w];
      lab = ['Kurang Aktif', 'Cukup Aktif', 'Aktif', 'Sangat Aktif', 'Luar Biasa']; sat = ' langkah'; judul = 'Kategori Langkah Harian'; nama = 'langkah'; ket = 'jumlah langkah dalam sehari (bilangan bulat)';
    }
    const aturan = [`${nama} < ${bnd[0]}${sat} → "${lab[0]}"`].concat([0, 1, 2].map(i => `${bnd[i]} ≤ ${nama} < ${bnd[i + 1]}${sat} → "${lab[i + 1]}"`)).concat([`${nama} ≥ ${bnd[3]}${sat} → "${lab[4]}"`]);
    const cat = (x) => { for (let i = 0; i < 4; i++) if (x < bnd[i]) return lab[i]; return lab[4]; };
    const tes = [bnd[0] - r.randint(1, 3), bnd[0], r.randint(bnd[0] + 1, bnd[1] - 1), bnd[1], bnd[2], Math.floor((bnd[2] + bnd[3]) / 2), bnd[3]];
    let ref = `${nama} = int(input())\nif ${nama} < ${bnd[0]}:\n    print("${lab[0]}")\n`;
    for (let i = 0; i < 3; i++) ref += `elif ${nama} < ${bnd[i + 1]}:\n    print("${lab[i + 1]}")\n`;
    ref += `else:\n    print("${lab[4]}")`;
    return {
      judul,
      teks: `Tentukan kategori berdasarkan ${ket}.\nInput: ${ket}.\nProses: gunakan if – elif – elif – elif – else dengan aturan berikut.\n` + aturan.map(a => '• ' + a).join('\n') + '\nOutput: tampilkan kategorinya.',
      contoh: `Input: ${tes[2]}  →  ${cat(tes[2])}      Input: ${tes[5]}  →  ${cat(tes[5])}`,
      ref, tes: tes.map(x => ({ input: [x], harap_teks: cat(x), tepat: true })),
    };
  }

  // ---------- SOAL 5: loop + list ----------
  function s5(P, r) {
    const C = {
      A: { judul: 'Rekap Nilai Ulangan', data: 'nilai ulangan', lo: 55, hi: 100, batas: r.choice([70, 75, 78]), syarat: '≥', ekstrem: 'tertinggi', ket: 'tuntas' },
      B: { judul: 'Rekap Langkah Harian', data: 'jumlah langkah per hari', lo: 3000, hi: 12000, batas: r.choice([7000, 8000]), syarat: '≥', ekstrem: 'tertinggi', ket: 'mencapai target' },
      C: { judul: 'Rekap Penjualan Kue', data: 'jumlah kue terjual per hari', lo: 10, hi: 60, batas: r.choice([30, 35, 40]), syarat: '≥', ekstrem: 'tertinggi', ket: 'mencapai target' },
      D: { judul: 'Rekap Waktu Lari', data: 'waktu lari 100 m (detik)', lo: 12, hi: 20, batas: r.choice([15, 16]), syarat: '≤', ekstrem: 'tercepat (terkecil)', ket: 'lolos seleksi' },
    }[P];
    const gen = (n) => Array.from({ length: n }, () => r.randint(C.lo, C.hi));
    const b = C.batas, le = C.syarat === '≤';
    const sets = [gen(5), gen(4), gen(6)];
    sets[1][r.randrange(4)] = b; sets[2][r.randrange(6)] = b;
    const hasil = (d) => { const t = d.reduce((a, x) => a + x, 0); return [t, pyround2(t / d.length), d.filter(x => le ? x <= b : x >= b).length, le ? Math.min(...d) : Math.max(...d)]; };
    const op = le ? '<=' : '>=', fn = le ? 'min' : 'max', E = C.ekstrem.split(' ')[0]; const Ecap = E[0].toUpperCase() + E.slice(1);
    const ref = `n = int(input())\ndata = []\nfor i in range(n):\n    data.append(int(input()))\ntotal = 0\njumlah = 0\nfor x in data:\n    total = total + x\n    if x ${op} ${b}:\n        jumlah = jumlah + 1\nrata = round(total / n, 2)\nprint("Total:", total)\nprint("Rata-rata:", rata)\nprint("Banyak ${C.ket}:", jumlah)\nprint("${Ecap}:", ${fn}(data))`;
    const d0 = sets[0], h0 = hasil(d0);
    return {
      judul: C.judul,
      teks: `Buat program untuk merekap ${C.data}.\nInput: banyak data n, lalu n buah data (masing-masing bilangan bulat, satu per baris). Simpan setiap data ke dalam list dengan perulangan.\nProses: hitung total, rata-rata (dibulatkan 2 angka di belakang koma dengan round), banyak data yang ${C.ket} (data ${C.syarat} ${b}), dan data ${C.ekstrem}.\nOutput: tampilkan total, rata-rata, banyak data yang ${C.ket}, dan data ${C.ekstrem}.`,
      contoh: `Input: n = ${d0.length}, data = ${d0.join(', ')}  →  Total = ${h0[0]}, Rata-rata = ${h0[1]}, Banyak ${C.ket} = ${h0[2]}, ${Ecap} = ${h0[3]}`,
      ref, tes: sets.map(d => ({ input: [d.length].concat(d), harap: hasil(d) })),
    };
  }

  // ---------- SOAL 6: debugging ----------
  function s6(P, r) {
    let bug, fix, tes, harap, judul, jelas, bugs;
    if (P === 'A') {
      const kk = r.choice([70, 72, 75, 76, 78, 80]);
      bug = `nama = input("Nama: ")\nnilai1 = input("Nilai 1: ")\nnilai2 = int(input("Nilai 2: "))\nrata = (nilai1 + nilai2) / 2\nif rata >= ${kk}\n    print(nama, "tuntas dengan rata-rata", rata)\nelse:\nprint(nama, "belum tuntas dengan rata-rata", rata)`;
      fix = `nama = input("Nama: ")\nnilai1 = int(input("Nilai 1: "))\nnilai2 = int(input("Nilai 2: "))\nrata = (nilai1 + nilai2) / 2\nif rata >= ${kk}:\n    print(nama, "tuntas dengan rata-rata", rata)\nelse:\n    print(nama, "belum tuntas dengan rata-rata", rata)`;
      tes = [['Ani', kk + r.randint(0, 10), kk + r.randint(-4, 6)], ['Budi', kk - r.randint(3, 9), kk - r.randint(1, 5)], ['Caca', r.randint(85, 100), r.randint(85, 100)]];
      harap = (t) => { const m = (t[1] + t[2]) / 2; return m < kk ? { harap: [m], harap_teks: 'belum' } : { harap: [m], harap_teks: 'tuntas', tolak: 'belum' }; };
      judul = 'Perbaiki Program Ketuntasan'; bugs = ['nilai1 belum diubah ke int()', 'titik dua (:) setelah if hilang', 'print setelah else tidak menjorok'];
      jelas = 'Program ini seharusnya membaca nama dan dua nilai, menghitung rata-rata, lalu menentukan tuntas atau belum tuntas.';
    } else if (P === 'B') {
      const h = r.choice([4000, 4500, 5000, 6000, 7000, 7500, 8000]);
      bug = `jumlah = input("Jumlah buku: ")\ntotal = 0\nfor i in range(1, jumlah + 1)\n    total = total + ${h}\nif total > 30000:\n    total = total - 2000\nprint("Total bayar:" total)`;
      fix = `jumlah = int(input("Jumlah buku: "))\ntotal = 0\nfor i in range(1, jumlah + 1):\n    total = total + ${h}\nif total > 30000:\n    total = total - 2000\nprint("Total bayar:", total)`;
      tes = [[r.randint(2, 4)], [r.randint(5, 7)], [r.randint(8, 12)]];
      harap = (t) => ({ harap: [t[0] * h - (t[0] * h > 30000 ? 2000 : 0)] });
      judul = 'Perbaiki Program Kasir Buku'; bugs = ['jumlah belum diubah ke int()', 'titik dua (:) setelah for hilang', 'koma di print hilang'];
      jelas = `Program ini seharusnya menghitung total harga buku tulis (Rp${rp(h)} per buku), lalu memberi potongan Rp2.000 jika total lebih dari Rp30.000.`;
    } else if (P === 'C') {
      const t_ = r.choice([5, 6, 7]);
      bug = `n = int(input("Banyak hari: "))\nhadir = 0\nfor i in range(n):\n    status = input("Status (H/A): ")\n    if status = "H":\n    hadir = hadir + 1\npersen = hadir / n * 10\nprint("Hadir:", hadir, "hari")\nprint("Persentase:", round(persen))`;
      fix = `n = int(input("Banyak hari: "))\nhadir = 0\nfor i in range(n):\n    status = input("Status (H/A): ")\n    if status == "H":\n        hadir = hadir + 1\npersen = hadir / n * 100\nprint("Hadir:", hadir, "hari")\nprint("Persentase:", round(persen))`;
      const seqs = [Array.from({ length: 5 }, () => r.choice(['H', 'H', 'H', 'A'])), Array.from({ length: 4 }, () => r.choice(['H', 'A'])), Array(t_).fill('H').concat(['A'])];
      tes = seqs.map(s => [s.length].concat(s));
      harap = (t) => { const h = t.slice(1).filter(x => x === 'H').length; return { harap: [h, Math.round(h / t[0] * 100)] }; };
      judul = 'Perbaiki Program Rekap Kehadiran'; bugs = ['= harus == pada if', 'hadir = hadir + 1 tidak menjorok di dalam if', 'persen dikali 10, seharusnya 100'];
      jelas = 'Program ini seharusnya membaca status kehadiran (H = hadir, A = tidak hadir) selama n hari, lalu menampilkan jumlah hari hadir dan persentasenya.';
    } else {
      const tarif = r.choice([1000, 1500, 2000, 2500, 3000]), awal = r.choice([2000, 3000, 4000]);
      bug = `jam = int(input("Lama parkir (jam): "))\nif jam <= 1:\n    biaya = ${awal}\nelse:\n    biaya = ${awal} + (jam + 1) * ${tarif}\n    print("Biaya parkir:", biaya)\nprint("Terima kasih)`;
      fix = `jam = int(input("Lama parkir (jam): "))\nif jam <= 1:\n    biaya = ${awal}\nelse:\n    biaya = ${awal} + (jam - 1) * ${tarif}\nprint("Biaya parkir:", biaya)\nprint("Terima kasih")`;
      tes = [[1], [r.randint(2, 4)], [r.randint(5, 9)]];
      harap = (t) => ({ harap: [t[0] <= 1 ? awal : awal + (t[0] - 1) * tarif] });
      judul = 'Perbaiki Program Biaya Parkir'; bugs = ['(jam + 1) seharusnya (jam - 1)', 'print biaya menjorok di dalam else', 'tanda kutip penutup "Terima kasih" hilang'];
      jelas = `Program ini seharusnya menghitung biaya parkir motor: jam pertama Rp${rp(awal)}, setiap jam berikutnya Rp${rp(tarif)}, lalu selalu menampilkan biaya dan ucapan terima kasih.`;
    }
    return {
      judul, teks: jelas + '\nProgram di bawah masih salah (ada error dan/atau hasil yang keliru). Temukan semua kesalahannya, lalu perbaiki sampai program berjalan dengan benar.',
      kode_awal: bug, ref: fix, bugs, contoh: '', tes: tes.map(t => Object.assign({ input: t }, harap(t))),
    };
  }

  const GEN = [s1, s2, s3, s4, s5, s6];
  const JENIS = [
    { no: 1, nama: 'Persen (input – proses – output)', kes: 'Mudah', bobot: 10 },
    { no: 2, nama: 'Pembagian bulat // dan sisa %', kes: 'Mudah', bobot: 10 },
    { no: 3, nama: 'Percabangan 2 kondisi', kes: 'Sedang', bobot: 15 },
    { no: 4, nama: 'Percabangan 5 kondisi', kes: 'Sedang', bobot: 15 },
    { no: 5, nama: 'Perulangan + list (rekap)', kes: 'Sukar', bobot: 25 },
    { no: 6, nama: 'Perbaiki program (debugging)', kes: 'Sukar', bobot: 25 },
  ];

  function buatSoal(no, seed) {
    const r = RNG(seed);
    const P = 'ABCD'[r.randrange(4)];
    const q = GEN[no - 1](P, r);
    q.no = no; q.konteks = P; q.seed = seed;
    return q;
  }

  // pencocokan sama dengan penilai ujian
  function angka(s) { return (s.match(/-?\d+(?:\.\d+)?/g) || []).map(Number); }
  function cocok(out, t) {
    let ok = true;
    if (t.harap) {
      const nums = angka(out); let pos = 0;
      for (const h of t.harap) {
        while (pos < nums.length && Math.abs(nums[pos] - h) > 0.011) pos++;
        if (pos >= nums.length) { ok = false; break; }
        pos++;
      }
    }
    if (t.harap_teks) {
      if (t.tepat) ok = ok && out.trim().split('\n').map(l => l.trim()).includes(t.harap_teks);
      else ok = ok && out.toLowerCase().includes(t.harap_teks.toLowerCase());
    }
    if (t.tolak) ok = ok && !out.toLowerCase().includes(t.tolak.toLowerCase());
    return ok;
  }
  function harapTeks(t) {
    const f = (v) => Number.isInteger(v) ? String(v) : String(r2(v));
    const a = [];
    if (t.harap) a.push(t.harap.map(f).join(', '));
    if (t.harap_teks) a.push(`"${t.harap_teks}"` + (t.tepat ? ' (persis)' : ''));
    if (t.tolak) a.push(`tanpa kata "${t.tolak}"`);
    return a.join(' · ');
  }

  // seed deterministik dari teks (FNV-1a 32-bit)
  function seedDari(str) { let h = 0x811c9dc5; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h >>> 0; }
  // satu paket ujian: 6 soal dengan konteks P (A-D) yang sama
  function buatPaket(P, seed) {
    const r = RNG(seed);
    return GEN.map((g, i) => { const q = g(P, r); q.no = i + 1; q.konteks = P; q.bobot = [10, 10, 15, 15, 25, 25][i]; q.kesukaran = ['Mudah', 'Mudah', 'Sedang', 'Sedang', 'Sukar', 'Sukar'][i]; return q; });
  }
  // paket berdasarkan posisi duduk: baris A-D (4,4,4,5 kursi), pola papan catur
  function paketKursi(absen) {
    const a = (absen > 17 ? absen - 17 : absen) - 1;
    const row = Math.min(3, Math.floor(a / 4)), seat = a - 4 * row;
    return { sesi: absen > 17 ? 2 : 1, baris: 'ABCD'[row], kursi: seat + 1, paket: 'ABCD'[(seat + 2 * row) % 4] };
  }

  G.ASKA = { RNG, buatSoal, buatPaket, paketKursi, seedDari, cocok, harapTeks, JENIS, GEN };
  if (typeof module !== 'undefined') module.exports = G.ASKA;
})(typeof window !== 'undefined' ? window : globalThis);
