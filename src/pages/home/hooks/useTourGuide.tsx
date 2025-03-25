import { useCallback, useEffect } from 'preact/hooks';
import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

// App version - update this when you want to show the guide again
const APP_VERSION = '1.1.0';
const GUIDE_VERSION_KEY = 'app_guide_version';
const PC_MIN_WIDTH = 768; // Minimum width to be considered a PC display

export const useTourGuide = () => {
  // Check if we should show the guide automatically (PC resolution and version changed)
  const shouldShowGuide = useCallback(() => {
    const storedVersion = localStorage.getItem(GUIDE_VERSION_KEY);
    return !storedVersion || storedVersion !== APP_VERSION;
  }, []);

  // Define PC tour guide steps
  const getPCGuideSteps = useCallback(
    (): DriveStep[] => [
      {
        element: '#search-input',
        popover: {
          title: 'Search Input',
          description:
            'Use this search box to find servers, maps, players, modes, countries, and more. Results update in real-time as you type!',
          side: 'left' as const,
          align: 'start',
        },
      },
      {
        element: '#column-toggle',
        popover: {
          title: 'Column Visibility',
          description:
            'Customize which columns appear in your table. Show only the data that matters to you!',
          side: 'bottom' as const,
          align: 'center',
        },
      },
      {
        element: '#view-mode-toggle',
        popover: {
          title: 'View Mode Toggle',
          description:
            'Switch between list and map view modes to find servers in your preferred way. List view provides detailed information in a table format, while map view offers a geographical perspective.',
          side: 'left' as const,
          align: 'center',
        },
      },
      {
        element: '#help-guide-toggle',
        popover: {
          title: 'Help Guide',
          description:
            'Click this button anytime to replay the help guide and refresh your memory about the available features.',
          side: 'left' as const,
          align: 'center',
        },
      },
    ],
    [],
  );

  // Define mobile tour guide steps (only search and quick filters)
  const getMobileGuideSteps = useCallback(
    (): DriveStep[] => [
      {
        element: '#search-input',
        popover: {
          title: 'Search Input',
          description:
            'Use this search box to find servers, maps, players, modes, countries, and more. Results update in real-time as you type!',
          side: 'bottom' as const,
          align: 'center',
        },
      },
      {
        element: '#quick-filter-buttons',
        popover: {
          title: 'Quick Filters',
          description:
            'Apply filters to quickly find servers matching specific criteria. You can use multiple filters together and combine them with the search box for powerful queries!',
          side: 'bottom' as const,
          align: 'center',
        },
      },
      {
        element: '#view-mode-toggle',
        popover: {
          title: 'View Mode Toggle',
          description:
            'Switch between list and map view modes to find servers in your preferred way. List view provides detailed information in a table format, while map view offers a geographical perspective.',
          side: 'bottom' as const,
          align: 'center',
        },
      },
      {
        element: '#help-guide-toggle',
        popover: {
          title: 'Help Guide',
          description:
            'Click this button anytime to replay the help guide and refresh your memory about the available features.',
          side: 'bottom' as const,
          align: 'center',
        },
      },
    ],
    [],
  );

  const updateStorageVersion = useCallback(() => {
    localStorage.setItem(GUIDE_VERSION_KEY, APP_VERSION);
  }, []);

  const startPCTour = useCallback(() => {
    const guide = driver({
      showProgress: true,
      steps: getPCGuideSteps(),
    });

    guide.drive();

    updateStorageVersion();

    return guide;
  }, [getPCGuideSteps]);

  // Function to start the mobile tour
  const startMobileTour = useCallback(() => {
    const guide = driver({
      showProgress: true,
      steps: getMobileGuideSteps(),
    });

    guide.drive();

    updateStorageVersion();

    return guide;
  }, [getMobileGuideSteps]);

  // Start the appropriate tour based on screen size
  const startTour = useCallback(() => {
    const isPC = window.innerWidth >= PC_MIN_WIDTH;
    if (isPC) {
      return startPCTour();
    } else {
      return startMobileTour();
    }
  }, [startPCTour, startMobileTour]);

  // Auto-start the tour on first visit or when version changes
  useEffect(() => {
    if (!shouldShowGuide()) return;

    const guide = startTour();

    return () => {
      guide.destroy();
    };
  }, [shouldShowGuide, startTour]);

  return { startTour };
};
