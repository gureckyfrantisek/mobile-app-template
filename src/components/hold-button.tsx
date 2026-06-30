import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { ThemedText } from "@/components/themed-text";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "react-i18next";

interface HoldButtonProps {
  size?: number;
  strokeWidth?: number;
  holdDuration?: number;
  onStart?: () => void;
  onStop?: () => void;
}

export function HoldButton({
  size = 120,
  strokeWidth = 8,
  holdDuration = 2000,
  onStart,
  onStop,
}: HoldButtonProps) {
  const colors = useTheme();
  const { t } = useTranslation();
  const [isRunning, setIsRunning] = useState(false);
  const isRunningRef = useRef(false);
  const progress = useSharedValue(0);
  const innerSize = size - strokeWidth * 2;

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.backgroundElement, colors.highlight],
    ),
  }));

  const handleStop = () => {
    isRunningRef.current = false;
    setIsRunning(false);
    // eslint-disable-next-line react-hooks/immutability
    progress.value = withTiming(0, { duration: 300 });
    onStop?.();
  };

  const handlePressIn = () => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      setIsRunning(true);
      onStart?.();
    } else {
      // eslint-disable-next-line react-hooks/immutability
      progress.value = withTiming(
        1,
        { duration: holdDuration, easing: Easing.linear },
        (finished) => {
          if (finished) {
            scheduleOnRN(handleStop);
          }
        },
      );
    }
  };

  const handlePressOut = () => {
    if (isRunningRef.current && progress.value < 1) {
      cancelAnimation(progress);
      // eslint-disable-next-line react-hooks/immutability
      progress.value = withTiming(0, { duration: 300 });
    }
  };

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.outer,
          { width: size, height: size, borderRadius: size / 2 },
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.inner,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: colors.background,
            },
          ]}
        >
          <ThemedText type="small" style={styles.label}>
            {isRunning ? t("common.holdToStop") : t("common.start")}
          </ThemedText>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
});
