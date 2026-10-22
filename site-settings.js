/* =====================================================================
   ملف الإعلانات - هذا هو الملف الوحيد الذي تعدّله لإضافة الإعلانات
   (لو حدث خطأ هنا، تبقى الصفحة تعمل بدون إعلانات)
   ===================================================================== */
window.ADS_CONFIG = {

  /* Google AdSense (غير مستخدم حاليًا) */
  adsense: {
    client: '',
    slots: { top: '', landing: '', parent: '', bottom: '' }
  },

  /* Adsterra */
  custom: {
    top:     { html: ``, width: '100%', height: 90 },

    /* Native Banner - الصفحة الرئيسية */
    landing: { html: `
<script async="async" data-cfasync="false" src="https://bauval.org/21/d7600935e4117649112712b73272d467"></script>
<div id="container-d7600935e4117649112712b73272d467"></div>
`, width: '100%', height: 320 },

    parent:  { html: ``, width: '100%', height: 90 },

    /* Banner 160x600 - أسفل كل الصفحات */
    bottom:  { html: `
<script>
  atOptions = {
    'key' : '63747310c4378b33fc04ffad6fdc5f28',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://bauval.org/22/63747310c4378b33fc04ffad6fdc5f28"></script>
`, width: '160px', height: 600 }
  },

  /* سكربتات عامة (موقوفة حاليًا): لتشغيل أي سطر احذف علامتي // من أوله
     تأكد من نوعه في لوحة Adsterra أولًا: Popunder يزعج الطلاب، أما Social Bar فخفيف */
  globalScripts: [
    // 'https://abscloud.org/1/cfffd8ba34411151715d01ece25d9139',
    // 'https://bauval.org/14/2bf1aa79e8fe78de35ee88895101db4a'
  ]

  /* Direct Link (موقوف، ليس بانرًا): https://araplhn.org/4/c164159cbf9cec32544a6aa5e2ca9563 */
};
