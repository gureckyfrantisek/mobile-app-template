import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import cs from "@/locales/cs.json";
import en from "@/locales/en.json";

// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    cs: { translation: cs },
  },
  lng: Localization.getLocales()[0]?.languageCode ?? "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  initImmediate: true,
});

export default i18n;
