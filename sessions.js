/* نظام الحصص والحسابات والتقويم - ملف إضافي (لا يغيّر الكود الأصلي) */
var TEACHER_SHARE_PERCENT = 100; // نسبة المدرس من إيراد الحصة (100 = كل الإيراد للمدرس، 80 = بعد خصم عمولة 20%)

(function () {
  if (typeof dbRef === 'undefined' || !dbRef) return;

  var SX = { sessions: {}, payments: {} };
  var $ = function (id) { return document.getElementById(id); };
  var L = function (o) { return Object.keys(o || {}).map(function (k) { return o[k]; }); };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
  var money = function (n) { return Number(n || 0).toLocaleString('ar-EG') + ' ج'; };
  var due = function (s) { return (s.students || 0) * (s.price || 0) * TEACHER_SHARE_PERCENT / 100; };
  var tname = function (id) { var t = cloudData.teachers[id]; return t ? t.name : '-'; };
  var emptyRow = function (n, m) { return '<tr><td colspan="' + n + '" style="text-align:center;">' + m + '</td></tr>'; };
  var MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  var DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  var cal = new Date(); cal.setDate(1);
  var sel = iso(new Date());

  function stats(tid) {
    var t = iso(new Date()), r = { n: 0, due: 0, paid: 0, rest: 0 };
    L(SX.sessions).forEach(function (s) { if (s.teacherId === tid && s.date <= t) { r.n++; r.due += due(s); } });
    L(SX.payments).forEach(function (x) { if (x.teacherId === tid) r.paid += x.amount || 0; });
    r.rest = r.due - r.paid;
    return r;
  }

  function wa(t, s) {
    var p = String((t && t.phone) || '').replace(/\D/g, '');
    if (!p) return '';
    if (p.indexOf('00') === 0) p = p.slice(2); else if (p.charAt(0) === '0') p = '20' + p.slice(1);
    var msg = 'تذكير من منصة المجتهد: لديك حصة بتاريخ ' + s.date + ' الساعة ' + s.time + ' (' + s.students + ' طالب). بالتوفيق 🌟';
    return 'https://wa.me/' + p + '?text=' + encodeURIComponent(msg);
  }

  function daySessions(d, gov) {
    return L(SX.sessions).filter(function (s) {
      var t = cloudData.teachers[s.teacherId];
      return s.date === d && (!gov || (t && t.gov === gov));
    }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
  }

  function dayTable(rows) {
    var h = '';
    rows.forEach(function (s) {
      var t = cloudData.teachers[s.teacherId] || {}, u = wa(t, s);
      h += '<tr><td>' + esc(s.time) + '</td><td><strong>' + esc(t.name || '-') + '</strong></td><td>' + esc(t.gov || '-') + '</td><td>' + esc(t.subject || '-') + '</td><td>' + esc(s.students) + '</td><td>' +
        (u ? '<a class="btn btn-success" style="padding:4px 8px;font-size:.8rem" target="_blank" rel="noopener noreferrer" href="' + u + '">📲 واتساب</a>' : '-') + '</td></tr>';
    });
    return h || emptyRow(6, 'لا توجد حصص في هذا اليوم');
  }

  /* ---------- الأدمن ---------- */
  function renderSched() {
    var rows = daySessions($('sx-a-date').value, $('sx-a-gov').value), stu = 0;
    rows.forEach(function (s) { stu += s.students || 0; });
    $('sx-a-body').innerHTML = dayTable(rows);
    $('sx-a-sum').textContent = rows.length + ' حصة | ' + stu + ' طالب';
  }

  function renderAcc() {
    var h = '', T = { n: 0, due: 0, paid: 0, rest: 0 };
    L(cloudData.teachers).forEach(function (t) {
      var s = stats(t.id);
      T.n += s.n; T.due += s.due; T.paid += s.paid; T.rest += s.rest;
      h += '<tr><td><strong>' + esc(t.name) + '</strong></td><td>' + s.n + '</td><td>' + money(s.due) + '</td><td>' + money(s.paid) + '</td><td>' + money(s.rest) +
        '</td><td><button class="btn btn-primary" style="padding:4px 8px;font-size:.8rem" data-id="' + esc(t.id) + '" onclick="sxPay(this.dataset.id)">💵 تسجيل سداد</button></td></tr>';
    });
    if (h) h += '<tr style="font-weight:800;background:#f8fafc"><td>الإجمالي</td><td>' + T.n + '</td><td>' + money(T.due) + '</td><td>' + money(T.paid) + '</td><td>' + money(T.rest) + '</td><td></td></tr>';
    $('sx-acc-body').innerHTML = h || emptyRow(6, 'لا يوجد مدرسون بعد');
  }

  function renderCal() {
    var y = cal.getFullYear(), m = cal.getMonth(), n = new Date(y, m + 1, 0).getDate(), off = (cal.getDay() + 1) % 7, cnt = {}, h = '';
    L(SX.sessions).forEach(function (s) { cnt[s.date] = (cnt[s.date] || 0) + 1; });
    $('sx-cal-title').textContent = MONTHS[m] + ' ' + y;
    for (var i = 0; i < off; i++) h += '<div class="sx-day empty"></div>';
    for (var d = 1; d <= n; d++) {
      var k = y + '-' + pad(m + 1) + '-' + pad(d);
      h += '<div class="sx-day' + (k === sel ? ' sel' : '') + '" data-d="' + k + '" onclick="sxDay(this.dataset.d)">' + d + (cnt[k] ? '<b>' + cnt[k] + ' حصة</b>' : '') + '</div>';
    }
    $('sx-cal-grid').innerHTML = h;
    $('sx-cal-sel').textContent = 'حصص يوم ' + sel;
    $('sx-cal-body').innerHTML = dayTable(daySessions(sel, ''));
  }

  function renderAdminSX() {
    var s = $('sx-a-gov'), cur = s.value, govs = [];
    L(cloudData.teachers).forEach(function (t) { if (t.gov && govs.indexOf(t.gov) < 0) govs.push(t.gov); });
    s.innerHTML = '<option value="">كل المحافظات</option>' + govs.map(function (g) { return '<option' + (g === cur ? ' selected' : '') + '>' + esc(g) + '</option>'; }).join('');
    renderSched(); renderAcc(); renderCal();
  }

  /* ---------- المدرس ---------- */
  function renderTeacherSX() {
    if (!currentUser || currentUser.role !== 'teacher') return;
    var id = currentUser.id, st = stats(id);
    var mine = L(SX.sessions).filter(function (s) { return s.teacherId === id; }).sort(function (a, b) { return a.date + a.time < b.date + b.time ? 1 : -1; });
    $('sx-t-body').innerHTML = mine.map(function (s) {
      return '<tr><td>' + esc(s.date) + '</td><td>' + esc(s.time) + '</td><td>' + esc(s.students) + '</td><td>' + money(s.price) + '</td><td>' + money(due(s)) +
        '</td><td><button class="btn btn-danger" style="padding:4px 8px;font-size:.8rem" data-id="' + esc(s.id) + '" onclick="sxDel(this.dataset.id)">🗑️</button></td></tr>';
    }).join('') || emptyRow(6, 'لم تضف حصصًا بعد');
    $('sx-t-n').textContent = st.n; $('sx-t-due').textContent = money(st.due);
    $('sx-t-paid').textContent = money(st.paid); $('sx-t-rest').textContent = money(st.rest);
    $('sx-t-pay').innerHTML = L(SX.payments).filter(function (x) { return x.teacherId === id; }).sort(function (a, b) { return a.date < b.date ? 1 : -1; })
      .map(function (x) { return '<tr><td>' + esc(x.date) + '</td><td>' + money(x.amount) + '</td></tr>'; }).join('') || emptyRow(2, 'لا توجد مدفوعات بعد');
  }

  /* ---------- أفعال ---------- */
  window.sxPay = function (id) {
    var a = parseFloat(prompt('المبلغ المسدد للمدرس ' + tname(id) + ' (بالجنيه):'));
    if (!(a > 0)) return;
    var pid = 'P-' + Date.now();
    dbRef.child('payments').child(pid).set({ id: pid, teacherId: id, amount: a, date: iso(new Date()) });
  };
  window.sxDay = function (d) { sel = d; renderCal(); };
  window.sxCal = function (n) { cal.setMonth(cal.getMonth() + n); renderCal(); };
  window.sxAdd = function (e) {
    e.preventDefault();
    var n = parseInt($('sx-f-n').value, 10), p = parseFloat($('sx-f-p').value);
    if (!(n >= 1) || !(p >= 0)) { alert('تأكد من عدد الطلاب والمبلغ'); return; }
    var id = 'X-' + Date.now();
    dbRef.child('sessions').child(id).set({ id: id, teacherId: currentUser.id, date: $('sx-f-date').value, time: $('sx-f-time').value, students: n, price: p })
      .then(function () { e.target.reset(); $('sx-f-date').value = iso(new Date()); alert('تمت إضافة الحصة ✅'); })
      .catch(function () { alert('تعذر حفظ الحصة'); });
  };
  window.sxDel = function (id) {
    var s = SX.sessions[id];
    if (s && s.teacherId === currentUser.id && confirm('حذف هذه الحصة؟')) dbRef.child('sessions').child(id).remove();
  };

  /* ---------- بناء الواجهة ---------- */
  var css = document.createElement('style');
  css.textContent = '.sx-cal{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px}.sx-day{background:#fff;border-radius:10px;padding:.4rem;min-height:56px;cursor:pointer;border:1px solid #e2e8f0;font-weight:700;font-size:.9rem}.sx-day b{display:block;background:var(--primary);color:#fff;border-radius:12px;font-size:.65rem;padding:1px 4px;margin-top:4px;text-align:center}.sx-day.sel{border-color:var(--primary);box-shadow:0 0 0 2px #bae6fd}.sx-day.empty{background:transparent;border:none;cursor:default}.sx-head{font-weight:800;text-align:center;color:var(--text-muted);font-size:.7rem}.sx-box{background:#fff;padding:1.2rem;border-radius:14px;margin-bottom:1.2rem}.sx-sum{font-weight:700;margin-top:.8rem;color:var(--primary-dark)}';
  document.head.appendChild(css);

  var thead = '<thead><tr><th>الوقت</th><th>المدرس</th><th>المحافظة</th><th>المادة</th><th>الطلاب</th><th>تذكير</th></tr></thead>';
  document.querySelector('#view-admin .tabs-nav').insertAdjacentHTML('beforeend',
    '<div class="tab-item" onclick="switchTab(\'admin\',\'sessions-tab\',event)">📅 جدول الحصص</div>' +
    '<div class="tab-item" onclick="switchTab(\'admin\',\'accounts-tab\',event)">💰 الحسابات</div>' +
    '<div class="tab-item" onclick="switchTab(\'admin\',\'calendar-tab\',event)">🗓️ التقويم</div>');
  $('view-admin').insertAdjacentHTML('beforeend',
    '<div id="admin-sessions-tab" class="tab-content"><div class="sx-box"><div style="display:flex;gap:1rem;flex-wrap:wrap"><input type="date" id="sx-a-date" class="form-control" style="flex:1;min-width:150px"><select id="sx-a-gov" class="form-control" style="flex:1;min-width:150px"></select></div><div class="sx-sum" id="sx-a-sum"></div></div><div class="table-responsive"><table>' + thead + '<tbody id="sx-a-body"></tbody></table></div></div>' +
    '<div id="admin-accounts-tab" class="tab-content"><div class="table-responsive"><table><thead><tr><th>المدرس</th><th>الحصص المنفذة</th><th>المستحق</th><th>المسدد</th><th>المتبقي</th><th>سداد</th></tr></thead><tbody id="sx-acc-body"></tbody></table></div><p style="color:var(--text-muted);font-size:.85rem;margin-top:.8rem">المستحق = (عدد الطلاب × سعر الطالب) لكل حصة حتى اليوم × نسبة المدرس.</p></div>' +
    '<div id="admin-calendar-tab" class="tab-content"><div class="sx-box"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><button class="btn btn-primary" onclick="sxCal(-1)">▶</button><h4 id="sx-cal-title"></h4><button class="btn btn-primary" onclick="sxCal(1)">◀</button></div><div class="sx-cal">' +
    DAYS.map(function (d) { return '<div class="sx-head">' + d + '</div>'; }).join('') + '</div><div class="sx-cal" id="sx-cal-grid"></div></div><h4 id="sx-cal-sel" style="margin-bottom:.6rem"></h4><div class="table-responsive"><table>' + thead + '<tbody id="sx-cal-body"></tbody></table></div></div>');

  document.querySelector('#view-teacher .tabs-nav').insertAdjacentHTML('beforeend',
    '<div class="tab-item" onclick="switchTab(\'teacher\',\'sessions-tab\',event)">➕ الحصص</div>' +
    '<div class="tab-item" onclick="switchTab(\'teacher\',\'accounts-tab\',event)">💰 حساباتي</div>');
  $('view-teacher').insertAdjacentHTML('beforeend',
    '<div id="teacher-sessions-tab" class="tab-content"><div class="sx-box"><h4>➕ إضافة حصة:</h4><form onsubmit="sxAdd(event)" style="display:flex;gap:1rem;margin-top:1rem;flex-wrap:wrap"><input type="date" id="sx-f-date" class="form-control" required style="flex:1;min-width:140px"><input type="time" id="sx-f-time" class="form-control" required style="flex:1;min-width:120px"><input type="number" id="sx-f-n" class="form-control" min="1" placeholder="عدد الطلاب" required style="flex:1;min-width:110px"><input type="number" id="sx-f-p" class="form-control" min="0" step="any" placeholder="مبلغ كل طالب (ج)" required style="flex:1;min-width:130px"><button type="submit" class="btn btn-success">حفظ الحصة</button></form></div>' +
    '<div class="table-responsive"><table><thead><tr><th>التاريخ</th><th>الوقت</th><th>الطلاب</th><th>سعر الطالب</th><th>المستحق</th><th>حذف</th></tr></thead><tbody id="sx-t-body"></tbody></table></div></div>' +
    '<div id="teacher-accounts-tab" class="tab-content"><div class="stats-grid"><div class="stat-box"><div class="stat-info"><h4>الحصص المنفذة</h4><span id="sx-t-n">0</span></div></div><div class="stat-box"><div class="stat-info"><h4>المستحق</h4><span id="sx-t-due">0</span></div></div><div class="stat-box"><div class="stat-info"><h4>المسدد</h4><span id="sx-t-paid">0</span></div></div><div class="stat-box"><div class="stat-info"><h4>المتبقي</h4><span id="sx-t-rest">0</span></div></div></div>' +
    '<h4 style="margin-bottom:.6rem">سجل المدفوعات:</h4><div class="table-responsive"><table><thead><tr><th>التاريخ</th><th>المبلغ</th></tr></thead><tbody id="sx-t-pay"></tbody></table></div></div>');

  $('sx-a-date').value = iso(new Date());
  $('sx-f-date').value = iso(new Date());
  $('sx-a-date').addEventListener('change', renderSched);
  $('sx-a-gov').addEventListener('change', renderSched);

  /* ---------- ربط البيانات ---------- */
  var ra = window.renderAdminDashboard, rt = window.renderTeacherDashboard;
  window.renderAdminDashboard = function () { ra(); renderAdminSX(); };
  window.renderTeacherDashboard = function () { rt(); renderTeacherSX(); };
  function refresh() {
    if (!currentUser) return;
    if (currentUser.role === 'admin') renderAdminSX();
    else if (currentUser.role === 'teacher') renderTeacherSX();
  }
  ['sessions', 'payments'].forEach(function (k) {
    dbRef.child(k).on('value', function (sn) { SX[k] = sn.val() || {}; refresh(); });
  });
})();
