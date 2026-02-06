// React
import { useState, useEffect, useCallback } from 'react';

// Hook to manage layout
function useLayout() {
  const [isInterfacesVisible, setInterfacesVisibility] = useState(
    localStorage.getItem('isInterfacesPanelVisible')
      ? localStorage.getItem('isInterfacesPanelVisible') === 'true'
      : true
  );
  const [isActionsAndDataVisible, setActionsAndDataVisibility] = useState(
    localStorage.getItem('isActionsAndDataPanelVisible')
      ? localStorage.getItem('isActionsAndDataPanelVisible') === 'true'
      : true
  );

  const updateLayout = useCallback(() => {
    const rootElement = document.getElementById('root');

    if (!rootElement) return;

    if (isInterfacesVisible && isActionsAndDataVisible) {
      rootElement.style.gridTemplateColumns = '400px 1fr 400px';
    } else if (isInterfacesVisible) {
      rootElement.style.gridTemplateColumns = '400px 1fr 40px';
    } else if (isActionsAndDataVisible) {
      rootElement.style.gridTemplateColumns = '40px 1fr 400px';
    } else {
      rootElement.style.gridTemplateColumns = '40px 1fr 40px';
    }
  }, [isInterfacesVisible, isActionsAndDataVisible]);

  const updateInterfacesVisibility = (visible: boolean) => {
    setInterfacesVisibility(visible);
    localStorage.setItem('isInterfacesPanelVisible', visible.toString());
  };

  const updateActionsAndDataVisibility = (visible: boolean) => {
    setActionsAndDataVisibility(visible);
    localStorage.setItem('isActionsAndDataPanelVisible', visible.toString());
  };

  useEffect(() => {
    updateLayout();
  }, [isInterfacesVisible, isActionsAndDataVisible, updateLayout]);

  return {
    isInterfacesVisible,
    isActionsAndDataVisible,
    updateLayout,
    updateInterfacesVisibility,
    updateActionsAndDataVisibility,
  };
}

export default useLayout;
