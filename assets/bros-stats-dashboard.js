/* Private dashboard UI. Data is requested only from the protected same-origin report endpoint. */
(() => {
  'use strict';

  const allowedDays = new Set([7, 28, 90]);
  const byId = (id) => document.getElementById(id);
  const form = byId('report-controls');
  const selector = byId('report-days');
  const refreshButton = byId('refresh-button');
  const content = byId('report-content');
  const status = byId('report-status');
  const announcement = byId('status-announcement');
  const notice = byId('report-notice');
  const integer = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
  const shortDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const fullDate = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const loadedTime = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' });
  const totalsKeys = ['sessions', 'pageViews', 'whatsappClicks', 'packageSelections'];
  const metricIds = ['metric-sessions', 'metric-pageviews', 'metric-whatsapp', 'metric-packages'];
  const tables = [
    ['daily-table-body', 5], ['pages-table-body', 3], ['sources-table-body', 4],
    ['devices-table-body', 3], ['packages-table-body', 2], ['languages-table-body', 3],
  ];
  let activeController;
  let requestSequence = 0;

  class ReportError extends Error {
    constructor(kind) { super(kind); this.kind = kind; }
  }

  function count(value) {
    if (!Number.isSafeInteger(value) || value < 0) throw new ReportError('invalid');
    return value;
  }

  function text(value, fallback) {
    if (typeof value !== 'string') throw new ReportError('invalid');
    return value.trim().slice(0, 240) || fallback;
  }

  function date(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) throw new ReportError('invalid');
    const day = value.slice(0, 10);
    const parsed = new Date(`${day}T12:00:00Z`);
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== day) throw new ReportError('invalid');
    return { day, parsed };
  }

  function rows(value, transform) {
    if (!Array.isArray(value) || value.length > 1000) throw new ReportError('invalid');
    return value.map((row) => {
      if (!row || typeof row !== 'object' || Array.isArray(row)) throw new ReportError('invalid');
      return transform(row);
    });
  }

  function normalizeReport(report, days) {
    if (!report || typeof report !== 'object' || !report.range || !report.totals || report.range.days !== days || report.range.timezone !== 'Asia/Jakarta') throw new ReportError('invalid');
    const range = { from: date(report.range.from), to: date(report.range.to) };
    if (range.from.day > range.to.day) throw new ReportError('invalid');
    const totals = Object.fromEntries(totalsKeys.map((key) => [key, count(report.totals[key])]));
    const daily = rows(report.daily, (row) => ({ date: date(row.date), ...Object.fromEntries(totalsKeys.map((key) => [key, count(row[key])])) })).sort((a, b) => a.date.day.localeCompare(b.date.day));
    if (daily.length > 90 || new Set(daily.map((row) => row.date.day)).size !== daily.length) throw new ReportError('invalid');
    const pages = rows(report.pages, (row) => ({ path: text(row.path, '/').split(/[?#]/, 1)[0], pageViews: count(row.pageViews), whatsappClicks: count(row.whatsappClicks) }));
    const sources = rows(report.sources, (row) => ({ source: text(row.source, 'Tidak diketahui'), sessions: count(row.sessions), pageViews: count(row.pageViews), whatsappClicks: count(row.whatsappClicks) }));
    const devices = rows(report.devices, (row) => ({ device: text(row.device, 'Tidak diketahui'), sessions: count(row.sessions), pageViews: count(row.pageViews) }));
    const packages = rows(report.packages, (row) => ({ packageId: text(row.packageId, 'Tidak diketahui'), selections: count(row.selections) }));
    const languages = rows(report.languages, (row) => ({ language: text(row.language, 'Tidak diketahui'), pageViews: count(row.pageViews), whatsappClicks: count(row.whatsappClicks) }));
    return { range, totals, daily, pages, sources, devices, packages, languages };
  }

  function placeholder(id, columns, message) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = columns;
    cell.className = 'table-placeholder';
    cell.textContent = message;
    row.append(cell);
    byId(id).replaceChildren(row);
  }

  function table(id, data, columns, emptyMessage) {
    if (!data.length) { placeholder(id, columns.length, emptyMessage); return; }
    const fragment = document.createDocumentFragment();
    data.forEach((item) => {
      const row = document.createElement('tr');
      columns.forEach((column) => {
        const cell = document.createElement('td');
        cell.textContent = column.value(item);
        if (column.numeric) cell.classList.add('numeric');
        if (column.path) cell.classList.add('path-cell');
        row.append(cell);
      });
      fragment.append(row);
    });
    byId(id).replaceChildren(fragment);
  }

  function top(data, key) { return [...data].sort((a, b) => b[key] - a[key]).slice(0, 10); }
  function numeric(key) { return { value: (item) => integer.format(item[key]), numeric: true }; }

  function translated(value, mapping) {
    const key = value.toLowerCase();
    return Object.prototype.hasOwnProperty.call(mapping, key) ? mapping[key] : value;
  }

  function renderTables(report) {
    table('daily-table-body', report.daily, [{ value: (row) => fullDate.format(row.date.parsed) }, ...totalsKeys.map(numeric)], 'Belum ada aktivitas harian dalam rentang ini.');
    table('pages-table-body', top(report.pages, 'pageViews'), [{ value: (row) => row.path, path: true }, numeric('pageViews'), numeric('whatsappClicks')], 'Belum ada halaman yang tercatat.');
    table('sources-table-body', top(report.sources, 'sessions'), [{ value: (row) => translated(row.source, { direct: 'Langsung / tidak diketahui', unknown: 'Tidak diketahui', referral: 'Rujukan', google: 'Google (penelusuran + iklan)', bing: 'Bing', social: 'Media sosial', email: 'Email' }) }, numeric('sessions'), numeric('pageViews'), numeric('whatsappClicks')], 'Belum ada sumber kunjungan yang tercatat.');
    table('devices-table-body', top(report.devices, 'sessions'), [{ value: (row) => translated(row.device, { mobile: 'Ponsel', desktop: 'Komputer', tablet: 'Tablet', unknown: 'Tidak diketahui', other: 'Lainnya' }) }, numeric('sessions'), numeric('pageViews')], 'Belum ada perangkat yang tercatat.');
    table('packages-table-body', top(report.packages, 'selections'), [{ value: (row) => row.packageId, path: true }, numeric('selections')], 'Belum ada pilihan detail paket yang tercatat.');
    table('languages-table-body', top(report.languages, 'pageViews'), [{ value: (row) => translated(row.language, { id: 'Bahasa Indonesia', en: 'Bahasa Inggris', ms: 'Bahasa Melayu', unknown: 'Tidak diketahui', other: 'Lainnya' }) }, numeric('pageViews'), numeric('whatsappClicks')], 'Belum ada bahasa halaman yang tercatat.');
  }

  function renderChart(daily) {
    const chart = byId('daily-chart');
    const message = byId('chart-message');
    const axis = byId('chart-axis');
    const max = Math.max(0, ...daily.flatMap((row) => [row.sessions, row.pageViews]));
    if (!daily.length || !max) {
      chart.hidden = true;
      axis.hidden = true;
      message.textContent = 'Belum ada kunjungan atau tayangan yang tercatat dalam rentang ini.';
      message.hidden = false;
      return;
    }
    const fragment = document.createDocumentFragment();
    daily.forEach((row) => {
      const group = document.createElement('div');
      group.className = 'day-group';
      ['sessions', 'pageViews'].forEach((key) => {
        const bar = document.createElement('span');
        bar.className = key === 'sessions' ? 'chart-bar' : 'chart-bar chart-bar-views';
        bar.style.setProperty('--bar-height', `${(row[key] / max) * 100}%`);
        group.append(bar);
      });
      fragment.append(group);
    });
    chart.replaceChildren(fragment);
    byId('chart-first-date').textContent = shortDate.format(daily[0].date.parsed);
    byId('chart-last-date').textContent = shortDate.format(daily[daily.length - 1].date.parsed);
    chart.hidden = false;
    axis.hidden = false;
    message.hidden = true;
  }

  function showNotice(kind, title, description, needsAccess) {
    notice.dataset.kind = kind;
    byId('notice-title').textContent = title;
    byId('notice-description').textContent = description;
    byId('notice-symbol').textContent = kind === 'error' || kind === 'auth' ? '!' : 'i';
    byId('notice-action').hidden = !needsAccess;
    notice.hidden = false;
  }

  function setStatus(kind, label, message) {
    status.dataset.status = kind;
    status.textContent = label;
    announcement.textContent = message;
  }

  function clearReport(message) {
    metricIds.forEach((id) => { byId(id).textContent = '—'; });
    tables.forEach(([id, columns]) => placeholder(id, columns, message));
    byId('daily-chart').replaceChildren();
    byId('daily-chart').hidden = true;
    byId('chart-axis').hidden = true;
    byId('chart-message').hidden = true;
    byId('last-updated').textContent = 'Terakhir dimuat: —';
  }

  function showError(kind) {
    const states = {
      auth: ['Akses perlu diperiksa', 'Masuk kembali dengan akun tim yang diizinkan. Angka tidak ditampilkan sampai akses laporan berhasil.', 'Perlu masuk'],
      config: ['Layanan statistik belum tersedia', 'Konfigurasi atau penyimpanan laporan belum siap. Tim pengelola perlu memeriksanya sebelum statistik dapat ditampilkan. Tanda — bukan nol kunjungan.', 'Belum siap'],
      network: ['Laporan belum bisa dimuat', 'Periksa koneksi, lalu pilih Muat ulang. Tidak ada angka yang diperkirakan atau diganti dengan data contoh.', 'Gagal memuat'],
      timeout: ['Waktu memuat laporan habis', 'Layanan belum merespons tepat waktu. Pilih Muat ulang untuk mencoba lagi. Tanda — berarti data belum tersedia.', 'Waktu habis'],
      invalid: ['Format laporan belum dapat dibaca', 'Layanan merespons, tetapi data belum sesuai format dashboard. Hubungi pengelola; angka sengaja tidak ditampilkan agar tidak menyesatkan.', 'Perlu diperiksa'],
      server: ['Layanan laporan sedang bermasalah', 'Pilih Muat ulang beberapa saat lagi. Jika tetap gagal, hubungi pengelola. Statistik tidak ditampilkan sebagai nol saat terjadi kesalahan.', 'Gagal memuat'],
    };
    const [title, description, badge] = states[kind] || states.server;
    const state = kind === 'auth' || kind === 'config' ? kind : 'error';
    clearReport('Data belum tersedia.');
    showNotice(state, title, description, kind === 'auth');
    setStatus(state, badge, `${title}. ${description}`);
    byId('chart-message').textContent = 'Grafik belum tersedia karena laporan belum berhasil dimuat.';
    byId('chart-message').hidden = false;
  }

  async function loadReport() {
    const days = Number(selector.value);
    if (!allowedDays.has(days)) return;
    if (activeController) activeController.abort();
    const sequence = ++requestSequence;
    const controller = new AbortController();
    activeController = controller;
    let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 15000);
    content.classList.add('is-loading');
    content.setAttribute('aria-busy', 'true');
    refreshButton.disabled = true;
    notice.hidden = true;
    clearReport('Menunggu data laporan…');
    byId('chart-loading').hidden = false;
    byId('report-period').textContent = `${days} hari terakhir · WIB`;
    setStatus('loading', 'Memuat', `Memuat laporan ${days} hari terakhir.`);

    try {
      const response = await fetch(`/ops/analytics/report?days=${days}`, {
        method: 'GET', credentials: 'same-origin', cache: 'no-store',
        headers: { Accept: 'application/json' }, signal: controller.signal,
      });
      if (sequence !== requestSequence) return;
      if (response.redirected || response.status === 401 || response.status === 403) throw new ReportError('auth');
      const isJson = (response.headers.get('content-type') || '').includes('application/json');
      const payload = isJson ? await response.json() : null;
      if (!response.ok) {
        const errorCode = payload && (payload.code || (typeof payload.error === 'string' ? payload.error : payload.error && payload.error.code));
        if (response.status === 503 || ['not_configured', 'configuration_missing', 'stats_not_configured'].includes(errorCode)) throw new ReportError('config');
        throw new ReportError('server');
      }
      if (!isJson) throw new ReportError('invalid');
      const report = normalizeReport(payload, days);
      if (sequence !== requestSequence) return;
      totalsKeys.forEach((key, index) => { byId(metricIds[index]).textContent = integer.format(report.totals[key]); });
      byId('report-period').textContent = `${fullDate.format(report.range.from.parsed)} – ${fullDate.format(report.range.to.parsed)} · WIB`;
      byId('last-updated').textContent = `Terakhir dimuat: ${loadedTime.format(new Date())} WIB`;
      renderTables(report);
      renderChart(report.daily);
      const isEmpty = totalsKeys.every((key) => report.totals[key] === 0);
      if (isEmpty) {
        showNotice('empty', 'Belum ada aktivitas dalam rentang ini', 'Laporan berhasil dimuat dan nilainya nol. Jika pencatatan baru diaktifkan, data akan mulai muncul setelah ada aktivitas yang tercatat. Dashboard ini tidak mengambil riwayat lama dari GSC atau GA4.', false);
        setStatus('empty', 'Aktivitas nol', `Laporan ${days} hari berhasil dimuat. Belum ada aktivitas yang tercatat.`);
      } else {
        setStatus('ready', 'Data dimuat', `Laporan ${days} hari berhasil dimuat: ${integer.format(report.totals.sessions)} kunjungan dan ${integer.format(report.totals.pageViews)} tayangan halaman.`);
      }
    } catch (error) {
      if (sequence !== requestSequence) return;
      if (error.name === 'AbortError' && !timedOut) return;
      showError(timedOut ? 'timeout' : error instanceof ReportError ? error.kind : error instanceof SyntaxError ? 'invalid' : 'network');
    } finally {
      window.clearTimeout(timeout);
      if (sequence === requestSequence) {
        content.classList.remove('is-loading');
        content.setAttribute('aria-busy', 'false');
        byId('chart-loading').hidden = true;
        refreshButton.disabled = false;
        activeController = undefined;
      }
    }
  }

  form.addEventListener('submit', (event) => { event.preventDefault(); loadReport(); });
  selector.addEventListener('change', loadReport);
  window.addEventListener('pagehide', () => { if (activeController) activeController.abort(); });
  loadReport();
})();
