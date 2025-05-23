import { useCallback, useEffect, useRef } from 'preact/hooks';
import { useIntl } from 'react-intl';
import { driver, DriveStep } from 'driver.js';
import type { Driver } from 'driver.js';
import 'driver.js/dist/driver.css';

// App version - update this when you want to show the guide again
const APP_VERSION = '1.1.0';
const GUIDE_VERSION_KEY = 'app_guide_version';
const PC_MIN_WIDTH = 768; // Minimum width to be considered a PC display

export const useTourGuide = () => {
  const intl = useIntl();
  const guideRef = useRef<Driver | null>(null);
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
          title: intl.formatMessage({ id: 'app.guide.searchInput.title', defaultMessage: 'Search Input' }),
          description: intl.formatMessage({
            id: 'app.guide.searchInput.description',
            defaultMessage: 'Use this search box to find servers, maps, players, modes, countries, and more. Results update in real-time as you type!'
          }),
          side: 'left' as const,
          align: 'start',
        },
      },
      {
        element: '#column-toggle',
        popover: {
          title: intl.formatMessage({ id: 'app.guide.columnVisibility.title', defaultMessage: 'Column Visibility' }),
          description: intl.formatMessage({
            id: 'app.guide.columnVisibility.description',
            defaultMessage: 'Customize which columns appear in your table. Show only the data that matters to you!'
          }),
          side: 'bottom' as const,
          align: 'center',
        },
      },
      {
        element: '#view-mode-toggle',
        popover: {
          title: intl.formatMessage({ id: 'app.guide.viewModeToggle.title', defaultMessage: 'View Mode Toggle' }),
          description: intl.formatMessage({
            id: 'app.guide.viewModeToggle.description',
            defaultMessage: 'Switch between list and map view modes to find servers in your preferred way. List view provides detailed information in a table format, while map view offers a geographical perspective.'
          }),
          side: 'left' as const,
          align: 'center',
        },
      },
      {
        element: '#help-guide-toggle',
        popover: {
          title: intl.formatMessage({ id: 'app.guide.helpGuide.title', defaultMessage: 'Help Guide' }),
          description: intl.formatMessage({
            id: 'app.guide.helpGuide.description',
            defaultMessage: 'Click this button anytime to replay the help guide and refresh your memory about the available features.'
          }),
          side: 'left' as const,
          align: 'center',
        },
      },
    ],
    [intl],
  );

  // Define mobile tour guide steps (only search and quick filters)
  const getMobileGuideSteps = useCallback(
    (): DriveStep[] => [
      {
        element: '#search-input',
        popover: {
          title: intl.formatMessage({ id: 'app.guide.searchInput.title', defaultMessage: 'Search Input' }),
          description: intl.formatMessage({
            id: 'app.guide.searchInput.description',
            defaultMessage: 'Use this search box to find servers, maps, players, modes, countries, and more. Results update in real-time as you type!'
          }),
          side: 'bottom' as const,
          align: 'center',
        },
      },
      {
        element: '#quick-filter-buttons',
        popover: {
          title: intl.formatMessage({ id: 'app.guide.quickFilters.title', defaultMessage: 'Quick Filters' }),
          description: intl.formatMessage({
            id: 'app.guide.quickFilters.description',
            defaultMessage: 'Apply filters to quickly find servers matching specific criteria. You can use multiple filters together and combine them with the search box for powerful queries!'
          }),
          side: 'bottom' as const,
          align: 'center',
        },
      },
      {
        element: '#view-mode-toggle',
        popover: {
          title: intl.formatMessage({ id: 'app.guide.viewModeToggle.title', defaultMessage: 'View Mode Toggle' }),
          description: intl.formatMessage({
            id: 'app.guide.viewModeToggle.description',
            defaultMessage: 'Switch between list and map view modes to find servers in your preferred way. List view provides detailed information in a table format, while map view offers a geographical perspective.'
          }),
          side: 'bottom' as const,
          align: 'center',
        },
      },
      {
        element: '#help-guide-toggle',
        popover: {
          title: intl.formatMessage({ id: 'app.guide.helpGuide.title', defaultMessage: 'Help Guide' }),
          description: intl.formatMessage({
            id: 'app.guide.helpGuide.description',
            defaultMessage: 'Click this button anytime to replay the help guide and refresh your memory about the available features.'
          }),
          side: 'bottom' as const,
          align: 'center',
        },
      },
    ],
    [intl],
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
    requestAnimationFrame(() => {
      const isPC = window.innerWidth >= PC_MIN_WIDTH;
      if (isPC) {
        guideRef.current = startPCTour();
      } else {
        guideRef.current = startMobileTour();
      }
    });
  }, [startPCTour, startMobileTour]);

  // Auto-start the tour on first visit or when version changes
  useEffect(() => {
    if (!shouldShowGuide()) return;

    startTour();

    return () => {
      guideRef.current?.destroy();
    };
  }, [shouldShowGuide, startTour]);

  return { startTour };
};
