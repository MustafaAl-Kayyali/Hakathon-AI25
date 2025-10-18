import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'ar';

// Define the shape of our translations
interface TranslationKeys {
  [key: string]: string | { [key: string]: string };
}

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, TranslationKeys> = {
  en: {
    heroTitle: "Turn Your Land Paper into a Complete Smart Building Design",
    heroSubtitle: "AI-Powered Architectural Planning",
    heroDescription: "Our intelligent platform analyzes your land ownership document, detecting area, boundaries, and angles with high precision. Generate 6+ professional architectural plans tailored to your project.",
    getStarted: "Get Started",
    learnMore: "Learn More",
    uploadTitle: "Upload Your Land Document",
    uploadDropDescription: "Drop your land ownership document here or click to browse",
    uploadButton: "Upload Document",
    remove: "Remove",
    projectType: "Project Type",
    house: "House",
    school: "School",
    university: "University",
    commercial: "Commercial",
    budgetLabel: "Budget Range",
    budgetMin: "250K",
    budgetMax: "1.5M",
    generatePlans: "Generate Plans",
    generatedPlans: "Generated Plans",
    planCard: "Plan",
    view3D: "View in 3D",
    downloadPDF: "Download PDF",
    selectPlan: "Select Plan",
    newProject: "New Project",
    features: "Key Features",
    feature1Title: "AI Land Analysis",
    feature1Desc: "Automatic detection of area, boundaries, and angles from your document",
    feature2Title: "6+ Professional Plans",
    feature2Desc: "Multiple design options tailored to your budget and project type",
    feature3Title: "3D Previews",
    feature3Desc: "Visualize every design in realistic 3D before making a decision",
    feature4Title: "Detailed PDFs",
    feature4Desc: "Complete documentation with layouts, budgets, and QR codes",
    numberOfFloors: "Number of Floors",
    floor: "Floor",
    floors: "Floors",
    enterArea: "Enter area",
    m2: "m²",
    areaLabelShort: "Area",
    dunum: "Dunam",
    thousandSuffix: "K",
    millionSuffix: "M",
    uploadSuccess: "Document uploaded successfully!",
    errorUploadFile: "Please upload a land document first",
    errorInvalidArea: "Please enter a valid area greater than zero",
    generatingPlansToast: "Generating architectural plans...",
    planDetails: "Plan Details",
    layout: "Layout",
    estimatedCost: "Estimated Cost",
    selectThisPlan: "Select This Plan",
    viewIn3D: "View in 3D",
    downloadPdf: "Download PDF",
    areaLabel: "Area",
    layoutLabel: "Layout",
    floorsLabel: "Floors",
    estimatedCostLabel: "Est. Cost",
  },
  ar: {
    heroTitle: "حوّل وثيقة أرضك إلى تصميم بناء ذكي متكامل",
    heroSubtitle: "التخطيط المعماري بالذكاء الاصطناعي",
    heroDescription: "منصتنا الذكية تحلل وثيقة ملكية أرضك، وتكتشف المساحة والحدود والزوايا بدقة عالية. توليد أكثر من 6 مخططات معمارية احترافية مصممة خصيصًا لمشروعك.",
    getStarted: "ابدأ الآن",
    learnMore: "اعرف المزيد",
    uploadTitle: "ارفع وثيقة الأرض",
    uploadDropDescription: "اسحب وثيقة ملكية الأرض هنا أو انقر للتصفح",
    uploadButton: "رفع الوثيقة",
    remove: "إزالة",
    projectType: "نوع المشروع",
    house: "منزل",
    school: "مدرسة",
    university: "جامعة",
    commercial: "تجاري",
    budgetLabel: "نطاق الميزانية",
    budgetMin: "250 ألف",
    budgetMax: "1.5 مليون",
    generatePlans: "توليد المخططات",
    generatedPlans: "المخططات المولدة",
    planCard: "مخطط",
    view3D: "عرض ثلاثي الأبعاد",
    downloadPDF: "تحميل PDF",
    selectPlan: "اختر التصميم",
    newProject: "مشروع جديد",
    features: "المميزات الرئيسية",
    feature1Title: "تحليل الأرض بالذكاء الاصطناعي",
    feature1Desc: "كشف تلقائي للمساحة والحدود والزوايا من وثيقتك",
    feature2Title: "أكثر من 6 مخططات احترافية",
    feature2Desc: "خيارات تصميم متعددة مصممة حسب ميزانيتك ونوع مشروعك",
    feature3Title: "معاينات ثلاثية الأبعاد",
    feature3Desc: "تصور كل تصميم بشكل واقعي قبل اتخاذ القرار",
    feature4Title: "ملفات PDF مفصلة",
    feature4Desc: "توثيق كامل مع المخططات والميزانيات ورموز QR",
    numberOfFloors: "عدد الطوابق",
    floor: "طابق",
    floors: "طوابق",
    enterArea: "أدخل المساحة",
    m2: "م²",
    areaLabelShort: "المساحة",
    dunum: "دونم",
    thousandSuffix: "ألف",
    millionSuffix: "مليون",
    uploadSuccess: "تم رفع الوثيقة بنجاح!",
    errorUploadFile: "يرجى رفع وثيقة الأرض أولاً",
    errorInvalidArea: "يرجى إدخال مساحة صالحة أكبر من صفر",
    generatingPlansToast: "جاري توليد المخططات المعمارية...",
    planDetails: "تفاصيل المخطط",
    layout: "التخطيط",
    estimatedCost: "التكلفة التقديرية",
    selectThisPlan: "اختر هذا المخطط",
    viewIn3D: "عرض ثلاثي الأبعاد",
    downloadPdf: "تحميل PDF",
    areaLabel: "المساحة",
    layoutLabel: "التصميم",
    floorsLabel: "الطوابق",
    estimatedCostLabel: "التكلفة التقديرية",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  // Load language from localStorage on initial render
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') as Language | null;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
      setIsRTL(savedLanguage === 'ar');
    } else if (navigator.language.startsWith('ar')) {
      setLanguage('ar');
      setIsRTL(true);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
    setIsRTL(newLang === 'ar');
    localStorage.setItem('preferredLanguage', newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: TranslationKey, fallback: string = ''): string => {
    try {
      const translation = translations[language]?.[key] || translations.en[key];
      if (!translation) {
        console.warn(`Missing translation for key: ${key}`);
        return fallback || key as string;
      }
      return translation as string;
    } catch (error) {
      console.error('Translation error:', error);
      return fallback || key as string;
    }
  };

  // Set initial HTML attributes
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, isRTL }}>
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={`${isRTL ? 'font-arabic' : ''} ${language}-content`}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// Export the context to be used with the useLanguage hook
export { LanguageContext };

export default LanguageProvider;