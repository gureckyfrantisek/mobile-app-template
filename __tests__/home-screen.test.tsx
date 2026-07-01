import { render, screen } from "@testing-library/react-native";

import HomeScreen from "@/app/(tabs)/index";
import { PreferencesProvider } from "@/context/preferences";
import i18n from "@/i18n";

describe("HomeScreen", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("renders the home title text and the HoldButton", async () => {
    await render(
      <PreferencesProvider>
        <HomeScreen />
      </PreferencesProvider>,
    );

    expect(screen.getByText("Home")).toBeTruthy();
    expect(screen.getByText("Start")).toBeTruthy();
  });
});