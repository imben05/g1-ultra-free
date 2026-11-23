/**
 * g1-ultra-free.js — Module dò & mở khóa mã Google AI Ultra 30 TB (free 1 tháng / giảm 90%) trên iOS Shadowrocket
 *
 * - Ánh xạ từng nút trên trang Google One sang từng ứng viên mã Ultra 30 TB để bấm test nhanh.
 * - Hiển thị bảng chú thích nhỏ gọn có thể thu gọn ở đầu trang để biết chính xác nút nào tương ứng mã nào.
 * - Không gửi mạng ngoài, không thu thập dữ liệu.
 */
"use strict";

console.log("[g1-ultra-free] v1.0 đã nạp");

/* Ánh xạ các nút trên màn hình Google One (Tháng + Năm) sang các ứng viên Ultra 30TB */
var TEST_MAP = [
  /* 6 nút tab HÀNG THÁNG */
  { from: "g1.ios.30gb.m",    to: "g1.ios.30tb.ai.pro.m",           label: "Nút 30 GB (Tháng)" },
  { from: "g1.ios.100gb.m",   to: "g1.30tb.1month_eft",             label: "Nút 100 GB (Tháng)" },
  { from: "g1.ios.helium.m",  to: "g1.ai.ultra.1month_eft",         label: "Nút AI Plus 400 GB (Tháng)" },
  { from: "g1.ios.2tb.m",     to: "g1.ai.pro.1month_eft",           label: "Nút 2 TB (Tháng)" },
  { from: "g1.ios.2tb.ai.m",  to: "g1.ai.ultra.3months_ip_90p.acq", label: "Nút AI Pro 5 TB (Tháng)" },
  { from: "g1.ios.20tb.m.v2", to: "g1.ios.30tb.m",                  label: "Nút Ultra 20 TB (Tháng)" },

  /* 5 nút tab HÀNG NĂM (đặt 2tb.ai.a trước 2tb.a để không trùng tiền tố) */
  { from: "g1.ios.2tb.ai.a",  to: "g1.ai.ultra.1month_ip_90p.acq",  label: "Nút AI Pro 5 TB (Năm)" },
  { from: "g1.ios.30gb.a",    to: "g1.ai.pro",                      label: "Nút 30 GB (Năm)" },
  { from: "g1.ios.100gb.a",   to: "g1.30tb",                        label: "Nút 100 GB (Năm)" },
  { from: "g1.ios.helium.a",  to: "g1.ios.30tb.ai.pro.m.v2",        label: "Nút AI Plus 400 GB (Năm)" },
  { from: "g1.ios.2tb.a",     to: "g1.20tb.1month_eft",             label: "Nút 2 TB (Năm)" }
];

function escHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function run() {
  var body = $response && $response.body;
  if (typeof body !== "string" || body === "") {
    $done({});
    return;
  }

  var out = body;
  var applied = [];

  for (var i = 0; i < TEST_MAP.length; i++) {
    var item = TEST_MAP[i];
    var re = new RegExp(escRe(item.from) + "(?![a-zA-Z0-9._-])", "g");
    var cnt = 0;
    out = out.replace(re, function () {
      cnt++;
      return item.to;
    });
    if (cnt > 0) {
      applied.push({ label: item.label, from: item.from, to: item.to, count: cnt });
      console.log("[g1-ultra-free] " + item.label + ": " + item.from + " -> " + item.to + " (x" + cnt + ")");
    }
  }

  if (applied.length === 0) {
    $done({});
    return;
  }

  /* Chèn bảng chú thích thu gọn ở đầu trang HTML */
  var closeIdx = out.toLowerCase().lastIndexOf("</body>");
  if (closeIdx !== -1) {
    var rows = [];
    for (var j = 0; j < applied.length; j++) {
      var a = applied[j];
      rows.push(
        '<div style="margin:2px 0;"><b style="color:#38bdf8;">' + escHtml(a.label) +
        '</b> → <span style="color:#4ade80;">' + escHtml(a.to) + '</span></div>'
      );
    }
    var panel =
      '<details style="position:fixed;top:0;left:0;right:0;z-index:2147483647;' +
      'background:#0f172a;color:#f8fafc;font-family:-apple-system,monospace;font-size:12px;' +
      'line-height:1.4;padding:8px 12px;border-bottom:2px solid #4ade80;' +
      'max-height:60vh;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,0.5);">' +
      '<summary style="font-weight:700;font-size:12px;color:#4ade80;cursor:pointer;">' +
      'G1 ULTRA FREE TEST (' + applied.length + ' nút đã map) — Chạm để xem/ẩn bảng mã' +
      '</summary>' +
      '<div style="margin-top:6px;">' + rows.join("") + '</div></details>';

    out = out.slice(0, closeIdx) + panel + out.slice(closeIdx);
  }

  $done({ body: out });
}

run();
