import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

i18next
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: {
          "Ghars": "غرس",
          "Weeks": "الأسابيع",
          "Leaderboard": "لوحة الشرف",
          "Dashboard": "لوحة التحكم",
          "Admin Panel": "لوحة الإدارة",
          "Logout": "تسجيل الخروج",
          "Login": "تسجيل الدخول",
          "home.title": "مشروع غرس",
          "home.description": "غرس مشروع طلابي بإشراف الأستاذ علي الحر البصري، يهدف إلى غرس القيم النبيلة لدى الطلبة عبر قيمة أسبوعية وتتبّع للنقاط وتحفيز مستمر للمتميزين.",
          "home.goToWeeks": "اذهب إلى صفحة الأسابيع",
          "home.more": "المزيد",
          "about.title": "ما هو مشروع غرس؟",
          "about.subtitle": "مشروع طلابي بإشراف الأستاذ علي الحر البصري",
          "feature1.title": "مبادرة طلابية",
          "feature1.description": "يقود الطلبة تنفيذ القيم أسبوعيًا بمشاركة جميع الصفوف.",
          "feature2.title": "إشراف تربوي",
          "feature2.description": "بإشراف الأستاذ علي الحر البصري لضمان الأثر التربوي.",
          "feature3.title": "تحفيز ونقاط",
          "feature3.description": "يجمع الطالب نقاطًا يومية وتُصرف مكافآت كل نهاية أسبوع."
        }
      }
    },
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18next;