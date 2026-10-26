# الخزنة المشفّرة

تحتوي هذه الخزنة على الشيفرة المصدرية المقروءة للنظام وأدوات البناء، مشفّرة بـ AES-256.
الملفات المنشورة في جذر المستودع نسخ محمية مولَّدة منها. لا يمكن فتح الخزنة بدون كلمة المرور.

| الملف | المحتوى |
|---|---|
| `source.tar.gz.enc` | مجلد `src/` كاملاً: الشيفرة المقروءة وسكربت البناء |
| `history-2026-10-26.bundle.enc` | نسخة احتياطية كاملة من تاريخ git حتى 2026-10-26 |

## الاستعادة على أي جهاز

يتطلب: `git` و`openssl` و`Node.js` (على Windows استخدم Git Bash، ففيه openssl).

```bash
git clone https://github.com/DaVinci-Ly/LibyaTenders.git
cd LibyaTenders
openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in vault/source.tar.gz.enc | tar xzf -
cd src && npm install
```

## التعديل والنشر

1. عدّل الملفات داخل `src/` فقط.
2. من داخل `src/` شغّل `npm run release`: يبني النسخ المحمية في الجذر، ثم يحدّث الخزنة (سيطلب كلمة المرور مرتين).
3. اعمل commit و push. ينشر GitHub Pages الموقع تلقائياً.

## استعادة التاريخ القديم (عند الحاجة فقط)

```bash
openssl enc -d -aes-256-cbc -pbkdf2 -iter 600000 -in vault/history-2026-10-26.bundle.enc -out history.bundle
git clone history.bundle old-history
```
