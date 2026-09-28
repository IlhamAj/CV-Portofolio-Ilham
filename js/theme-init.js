/* Set tema sebelum halaman kepaint, biar nggak ada kedipan warna.
   Default ikutin preferensi sistem (prefers-color-scheme); user bisa
   override manual lewat tombol di header (berlaku selama sesi ini,
   nggak disimpan permanen). */
(function(){
  var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.setAttribute('data-theme', prefersLight ? 'light' : 'dark');
})();
