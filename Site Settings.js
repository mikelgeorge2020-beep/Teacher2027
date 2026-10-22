/* =====================================================================
   ملف إعدادات الإعلانات - منصة المجتهد التعليمية
   ===================================================================== */
window.ADS_CONFIG = {

  /* Google AdSense (اتركه فارغاً إذا كنت لا تستخدمه) */
  adsense: {
    client: '',
    slots: { top: '', landing: '', parent: '', bottom: '' }
  },

  /* أكواد Adsterra وإعلانات الشبكات الأخرى */
  custom: {
    // إعلان أسرع في أعلى الصفحة (اختياري)
    top: { html: ``, width: '100%', height: 90 },

    /* Native Banner - يُعرض في الصفحة الرئيسية */
    landing: {
      html: `
        <script async="async" data-cfasync="false" src="https://bauval.org/21/d7600935e4117649112712b73272d467"></script>
        <div id="container-d7600935e4117649112712b73272d467"></div>
      `,
      width: '100%',
      height: 'auto'
    },

    // إعلان داخل لوحة ولي الأمر والطالب
    parent: { html: ``, width: '100%', height: 90 },

    /* Banner 160x600 - أسفل الصفحة */
    bottom: {
      html: `
        <script type="text/javascript">
          atOptions = {
            'key' : '63747310c4378b33fc04ffad6fdc5f28',
            'format' : 'iframe',
            'height' : 600,
            'width' : 160,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://bauval.org/22/63747310c4378b33fc04ffad6fdc5f28"></script>
      `,
      width: '160px',
      height: '600px'
    }
  },

  /* السكربتات المباشرة مثل Social Bar أو Popunder (ضع الروابط فقط إذا أردت تفعيلها) */
  globalScripts: [
    // 'https://abscloud.org/1/cfffd8ba34411151715d01ece25d9139',
    // 'https://bauval.org/14/2bf1aa79e8fe78de35ee88895101db4a'
  ]
};