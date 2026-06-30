import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import i18n from "@/i18n";

export type AppTheme = "system" | "light" | "dark";
export type AppLanguage = "en" | "cs";

interface Prefs {
  theme: AppTheme;
  language: AppLanguage;
  hasOnboarded: boolean;
}

interface PreferencesContextValue extends Prefs {
  isLoading: boolean;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (language: AppLanguage) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const STORAGE_KEY = "prefs";

const SUPPORTED_LANGUAGES: AppLanguage[] = ["en", "cs"];

function systemLanguage(): AppLanguage {
  const code = Localization.getLocales()[0]?.languageCode ?? "en";
  return SUPPORTED_LANGUAGES.includes(code as AppLanguage)
    ? (code as AppLanguage)
    : "en";
}

const DEFAULT: Prefs = {
  theme: "system",
  language: systemLanguage(),
  hasOnboarded: false,
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (raw) {
        try {
          const saved: Partial<Prefs> = JSON.parse(raw);
          const merged = { ...DEFAULT, ...saved };
          setPrefs(merged);
          if (merged.language !== DEFAULT.language) {
            i18n.changeLanguage(merged.language);
          }
        } catch {}
      }
      setIsLoading(false);
    });
  }, []);

  const save = useCallback((next: Prefs) => {
    setPrefs(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const setTheme = useCallback(
    (theme: AppTheme) => save({ ...prefs, theme }),
    [prefs, save],
  );

  const setLanguage = useCallback(
    (language: AppLanguage) => {
      i18n.changeLanguage(language);
      save({ ...prefs, language });
    },
    [prefs, save],
  );

  const completeOnboarding = useCallback(
    () => save({ ...prefs, hasOnboarded: true }),
    [prefs, save],
  );

  const resetOnboarding = useCallback(
    () => save({ ...prefs, hasOnboarded: false }),
    [prefs, save],
  );

  return (
    <PreferencesContext.Provider
      value={{
        ...prefs,
        isLoading,
        setTheme,
        setLanguage,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx)
    throw new Error("usePreferences must be used within PreferencesProvider");
  return ctx;
}
