import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type PermissionKey = "bluetooth" | "wifi" | "files";

type PermissionDef = {
  key: PermissionKey;
  androidPermissions: string[];
};

// Android permission keys: https://reactnative.dev/docs/permissionsandroid#permissions
// Full manifest permission list: https://developer.android.com/reference/android/Manifest.permission
const API_LEVEL =
  Platform.OS === "android"
    ? typeof Platform.Version === "number"
      ? Platform.Version
      : parseInt(Platform.Version, 10)
    : 0;

const PERMISSIONS: PermissionDef[] = [
  {
    key: "bluetooth",
    // BLUETOOTH_CONNECT / BLUETOOTH_SCAN require API 31 (Android 12+)
    androidPermissions:
      API_LEVEL >= 31
        ? [
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          ]
        : [],
  },
  {
    key: "wifi",
    androidPermissions: [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION],
  },
  {
    key: "files",
    // READ_MEDIA_IMAGES requires API 33 (Android 13+); fall back to READ_EXTERNAL_STORAGE
    androidPermissions:
      API_LEVEL >= 33
        ? [PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES]
        : [PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE],
  },
];

async function checkAll(): Promise<Record<PermissionKey, boolean>> {
  if (Platform.OS !== "android") {
    return { bluetooth: false, wifi: false, files: false };
  }
  const entries = await Promise.all(
    PERMISSIONS.map(async (def) => {
      const results = await Promise.all(
        def.androidPermissions.map((p) => PermissionsAndroid.check(p as any)),
      );
      return [def.key, results.every(Boolean)] as const;
    }),
  );
  return Object.fromEntries(entries) as Record<PermissionKey, boolean>;
}

async function requestOne(def: PermissionDef): Promise<boolean> {
  if (Platform.OS !== "android") {
    // TODO: add iOS-specific expo-* permission requests per package
    Linking.openSettings();
    return false;
  }
  if (def.androidPermissions.length === 1) {
    const result = await PermissionsAndroid.request(
      def.androidPermissions[0] as any,
    );
    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Linking.openSettings();
    }
    return result === PermissionsAndroid.RESULTS.GRANTED;
  }
  const results = await PermissionsAndroid.requestMultiple(
    def.androidPermissions as any,
  );
  const values = Object.values(results);
  if (values.some((r) => r === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN)) {
    Linking.openSettings();
  }
  return values.every((r) => r === PermissionsAndroid.RESULTS.GRANTED);
}

export default function PermissionsScreen() {
  const { t } = useTranslation();
  const colors = useTheme();
  const [granted, setGranted] = useState<Record<PermissionKey, boolean>>({
    bluetooth: false,
    wifi: false,
    files: false,
  });

  useEffect(() => {
    checkAll().then(setGranted);
  }, []);

  const handleToggle = useCallback(async (def: PermissionDef) => {
    const isGranted = await requestOne(def);
    setGranted((prev) => ({ ...prev, [def.key]: isGranted }));
  }, []);

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.center}>
          {t("onboarding.permissionsTitle")}
        </ThemedText>
        <ThemedText
          type="default"
          themeColor="textSecondary"
          style={styles.center}
        >
          {t("onboarding.permissionsSub")}
        </ThemedText>

        <View style={styles.list}>
          {PERMISSIONS.filter((def) => def.androidPermissions.length > 0).map(
            (def) => (
              <ThemedView
                key={def.key}
                type="backgroundElement"
                style={styles.row}
              >
                <View style={styles.text}>
                  <ThemedText type="smallBold">
                    {t(`onboarding.permission_${def.key}_title`)}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {t(`onboarding.permission_${def.key}_desc`)}
                  </ThemedText>
                </View>
                <Switch
                  value={granted[def.key]}
                  onValueChange={() => handleToggle(def)}
                  trackColor={{
                    false: colors.backgroundSelected,
                    true: colors.highlight,
                  }}
                  disabled={granted[def.key]}
                />
              </ThemedView>
            ),
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push("/(onboarding)/complete")}>
          <ThemedView type="backgroundSelected" style={styles.buttonInner}>
            <ThemedText type="smallBold">{t("onboarding.continue")}</ThemedText>
          </ThemedView>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.skip}
          onPress={() => router.push("/(onboarding)/complete")}
        >
          <ThemedText type="small" themeColor="textSecondary">
            {t("onboarding.skip")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: Spacing.four, justifyContent: "space-between" },
  content: { flex: 1, justifyContent: "center", gap: Spacing.three },
  center: { textAlign: "center" },
  list: { gap: Spacing.two, marginTop: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.three,
    borderRadius: 12,
    gap: Spacing.three,
  },
  text: { flex: 1, gap: 2 },
  actions: { gap: Spacing.two, marginTop: Spacing.three },
  buttonInner: {
    padding: Spacing.three,
    borderRadius: 12,
    alignItems: "center",
  },
  skip: { padding: Spacing.three, alignItems: "center" },
});
