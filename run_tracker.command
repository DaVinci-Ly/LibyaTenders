#!/bin/bash

# الانتقال إلى المجلد الذي يحتوي على هذا الملف
cd "$(dirname "$0")"

# تغيير عنوان نافذة Terminal
echo -ne "\033]0;Libya Government Tenders Tracker\007"

# تعريف الألوان لتنسيق النص
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # بدون لون

clear
echo -e "${BLUE}=======================================================${NC}"
echo -e "${GREEN}      متتبع العطاءات الحكومية الليبية (مشغل النظام)      ${NC}"
echo -e "${GREEN}      Libya Tenders Tracker - App Launcher             ${NC}"
echo -e "${BLUE}=======================================================${NC}"
echo ""

# التحقق من وجود Python 3
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ خطأ: Python 3 غير مثبت على جهازك!${NC}"
    echo -e "الرجاء تحميل وتثبيت Python 3 من الموقع الرسمي: https://www.python.org/"
    echo ""
    echo "اضغط على أي مفتاح للخروج..."
    read -n 1
    exit 1
fi

echo -e "${YELLOW}🔄 جاري تشغيل خادم النظام وفتح المتصفح...${NC}"
echo ""

# تشغيل خادم البايثون
python3 tenders_server.py

# في حال توقف الخادم بشكل غير متوقع، إبقاء النافذة مفتوحة لرؤية الخطأ
if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ حدث خطأ أثناء تشغيل النظام أو تم إيقافه.${NC}"
    echo "اضغط على أي مفتاح للخروج..."
    read -n 1
fi
