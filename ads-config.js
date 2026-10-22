/* =====================================================================
   ملف الإعلانات - هذا هو الملف الوحيد الذي تعدّله لإضافة الإعلانات
   (لو حدث خطأ هنا، تبقى الصفحة تعمل بدون إعلانات)
   ===================================================================== */
window.ADS_CONFIG = {

  /* Google AdSense: ضع رقم الناشر وأرقام الوحدات (اتركها فارغة لو غير مستخدمة) */
  adsense: {
    client: '',   // مثال: 'ca-pub-1234567890123456'
    slots: { top: '', landing: '', parent: '', bottom: '' }   // مثال: top: '1234567890'
  },

  /* Adsterra أو أي شبكة أخرى: الصق كود الإعلان كما هو بين علامتي ` `
     width/height بحسب مقاس الإعلان (بانر 468x60 مثلًا) */
  custom: {
    top:     { html: ``, width: '100%', height: 90 },
    landing: { html: ``, width: '100%', height: 90 },
    parent:  { html: ``, width: '100%', height: 90 },
    bottom:  { html: ``, width: '100%', height: 90 }
  },

  /* سكربتات عامة (Social Bar / Popunder / Native): ضع الرابط فقط */
  globalScripts: [
    // 'https://example.com/xxxx/invoke.js'
  ]
};
