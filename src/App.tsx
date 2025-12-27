// Hooks
import useLayout from "@hooks/useLayout";
import useGamepadController from "@hooks/useGamepadController";

// Components
import EditorPanel from "@panels/EditorPanel";
import InterfacesPanel from "@panels/InterfacesPanel";
import ActionsAndDataPanel from "@panels/ActionsAndDataPanel";

// Styles
import "@styles/main.css";

function App() {
  // Layout Hook
  const {
    isInterfacesVisible,
    isActionsAndDataVisible,
    updateInterfacesVisibility,
    updateActionsAndDataVisibility,
  } = useLayout();

  // Gamepad Controller Hook
  useGamepadController();

  // Render
  return (
    <>
      <InterfacesPanel
        isVisible={isInterfacesVisible}
        setVisibility={updateInterfacesVisibility}
      />

      <EditorPanel />

      <ActionsAndDataPanel
        isVisible={isActionsAndDataVisible}
        setVisibility={updateActionsAndDataVisibility}
      />
    </>
  );
}

export default App;
