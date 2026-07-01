import { fireEvent, render, screen } from "@testing-library/react-native";

import { HoldButton } from "@/components/hold-button";
import { PreferencesProvider } from "@/context/preferences";
import i18n from "@/i18n";

function renderHoldButton() {
  return render(
    <PreferencesProvider>
      <HoldButton />
    </PreferencesProvider>,
  );
}

describe("HoldButton", () => {
  beforeAll(async () => {
    await i18n.changeLanguage("en");
  });

  it("shows the start label when isStopped (not running)", async () => {
    await renderHoldButton();

    expect(screen.getByText("Start")).toBeTruthy();
  });

  it("shows the holdToStop label when !isStopped (pressed in)", async () => {
    await renderHoldButton();

    await fireEvent(screen.getByText("Start"), "pressIn");

    expect(screen.getByText("Hold to\nstop")).toBeTruthy();
  });
});
