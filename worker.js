/* Menjalankan program Python murid di Pyodide (Web Worker terpisah agar loop tak berujung bisa dihentikan). */
importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js');
let py = null;
const siap = (async () => {
  py = await loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/' });
  py.runPython(`
import sys, io, traceback, builtins

class _InputHabis(Exception):
    pass

_PESAN = {
  'NameError': 'Nama variabel/fungsi belum dikenal (cek ejaan atau variabel belum dibuat)',
  'TypeError': 'Tipe data tidak cocok (misalnya teks dijumlah dengan angka: lupa int()?)',
  'ValueError': 'Nilai tidak bisa diubah (misalnya int() menerima teks yang bukan angka)',
  'ZeroDivisionError': 'Pembagian dengan nol',
  'IndentationError': 'Indentasi (menjorok) tidak tepat',
  'SyntaxError': 'Penulisan kode salah (cek titik dua, tanda kutip, kurung, koma, atau = dan ==)',
  'IndexError': 'Indeks list di luar jangkauan',
  'AttributeError': 'Fungsi/atribut tidak ada pada data tersebut',
}

def _jalan(src, inputs, echo):
    buf = io.StringIO()
    q = list(inputs)
    def _input(prompt=''):
        if echo: buf.write(str(prompt))
        if not q:
            raise _InputHabis()
        v = q.pop(0)
        if echo: buf.write(v + '\\n')
        return v
    def _print(*a, sep=' ', end='\\n', file=None, flush=False):
        buf.write(sep.join(str(x) for x in a) + end)
    g = {'__name__': '__main__', 'input': _input, 'print': _print}
    err = None
    try:
        code = compile(src, '<program>', 'exec')
        exec(code, g)
    except _InputHabis:
        err = {'jenis': 'Input habis', 'baris': None, 'pesan': 'Program meminta input lebih banyak dari yang disediakan. Isi kotak Input (satu nilai per baris) atau periksa jumlah input().'}
    except SyntaxError as e:
        nama = type(e).__name__
        err = {'jenis': nama, 'baris': e.lineno, 'pesan': _PESAN.get(nama, nama) + (' — ' + str(e.msg) if e.msg else '')}
    except BaseException as e:
        nama = type(e).__name__
        tb = traceback.extract_tb(e.__traceback__)
        baris = None
        for fr in tb:
            if fr.filename == '<program>': baris = fr.lineno
        err = {'jenis': nama, 'baris': baris, 'pesan': _PESAN.get(nama, nama) + ' — ' + str(e)}
    return buf.getvalue(), err
`);
})();

self.onmessage = async (ev) => {
  const { id, code, inputs, echo } = ev.data;
  try {
    await siap;
    const f = py.globals.get('_jalan');
    const res = f(code, py.toPy(inputs.map(String)), !!echo);
    const [out, err] = res.toJs({ dict_converter: Object.fromEntries });
    res.destroy(); f.destroy();
    self.postMessage({ id, out, err: err || null });
  } catch (e) {
    self.postMessage({ id, out: '', err: { jenis: 'Sistem', baris: null, pesan: String(e) } });
  }
};
self.postMessage({ id: 'boot' });
siap.then(() => self.postMessage({ id: 'siap' }));
