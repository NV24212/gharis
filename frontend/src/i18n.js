import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// For now, we'll start with a simple translation file.
// We can add more translations as we build out the components.
const resources = {
  ar: {
    translation: {
      "Admin Panel": "لوحة التحكم",
      "Student Management": "إدارة الطلاب",
      "Week Management": "إدارة الأسابيع",
      "Logout": "تسجيل الخروج",
      "Login": "تسجيل الدخول",
      "Dashboard": "لوحة المعلومات",
      "Leaderboard": "قائمة المتصدرين",
      "About Ghars": "عن غرس",
      "Ghars": "غرس",
      "Add Student": "إضافة طالب",
      "Edit Student": "تعديل طالب",
      "Name": "الاسم",
      "Class": "الفصل",
      "Points": "النقاط",
      "Actions": "الإجراءات",
      "Password": "كلمة المرور",
      "New Password (optional)": "كلمة مرور جديدة (اختياري)",
      "Select Class": "اختر الفصل",
      "Cancel": "إلغاء",
      "Save": "حفظ",
      "Loading...": "جار التحميل...",
      "Are you sure you want to delete this student?": "هل أنت متأكد أنك تريد حذف هذا الطالب؟",
      "Failed to fetch data.": "فشل في جلب البيانات.",
      "Failed to delete student.": "فشل في حذف الطالب.",
      "Failed to update student.": "فشل في تحديث الطالب.",
      "Failed to add student.": "فشل في إضافة الطالب.",
      "Add Week": "إضافة أسبوع",
      "Edit Week": "تعديل الأسبوع",
      "Week No.": "رقم الأسبوع",
      "Title": "العنوان",
      "Status": "الحالة",
      "Unlocked": "مفتوح",
      "Locked": "مغلق",
      "Video URL": "رابط الفيديو",
      "Content Cards": "بطاقات المحتوى",
      "Card Title": "عنوان البطاقة",
      "Card Description": "وصف البطاقة",
      "Add Card": "إضافة بطاقة",
      "Are you sure you want to delete this week? This is irreversible.": "هل أنت متأكد من حذف هذا الأسبوع؟ هذا الإجراء لا يمكن التراجع عنه.",
      "Failed to fetch weeks.": "فشل في جلب الأسابيع.",
      "Failed to delete week.": "فشل في حذف الأسبوع.",
      "Failed to update week.": "فشل في تحديث الأسبوع.",
      "Failed to add week.": "فشل في إضافة الأسبوع.",
      "Loading weeks...": "جار تحميل الأسابيع...",
      "Week": "الأسبوع",
      "Fetching week details...": "جاري جلب تفاصيل الأسبوع...",
      "Failed to fetch week details.": "فشل في جلب تفاصيل الأسبوع.",
      "Week not found.": "الأسبوع غير موجود.",
      "Open video in new tab": "فتح الفيديو في نافذة جديدة",
      "Authentication required.": "مطلوب تسجيل الدخول.",
      "Weeks": "الأسابيع",
      "Enter": "ادخل",
      "Welcome": "أهلاً بك",
      "Total Points": "مجموع النقاط",
      "Loading dashboard...": "جاري تحميل لوحة المعلومات...",
      "Failed to fetch student data. Please try again later.": "فشل في جلب بيانات الطالب. يرجى المحاولة مرة أخرى لاحقًا.",
      "No student data available.": "لا توجد بيانات للطالب.",
      "No authentication token found.": "لم يتم العثور على رمز المصادقة.",
      "All-Time Leaderboard": "قائمة المتصدرين",
      "Rank": "الترتيب",
      "Loading leaderboard...": "جاري تحميل قائمة المتصدرين...",
      "Failed to fetch leaderboard data.": "فشل في جلب بيانات المتصدرين.",
      "Sign in to your account": "تسجيل الدخول إلى حسابك",
      "Enter your password to access the platform.": "أدخل كلمة المرور الخاصة بك للوصول إلى المنصة.",
      "Sign In": "تسجيل الدخول",
      "Invalid password or server error.": "كلمة المرور غير صحيحة أو حدث خطأ في الخادم."
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'ar', // default language
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;