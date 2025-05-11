
import { useState, useEffect } from 'react';

export type DefaultCalendarView = 'day' | 'week' | 'month';

export function useDefaultCalendarView() {
  const [defaultCalendarView, setDefaultCalendarViewState] = useState<DefaultCalendarView>('week');

  // Load saved preference on mount
  useEffect(() => {
    const savedView = localStorage.getItem('defaultCalendarView') as DefaultCalendarView;
    if (savedView && (savedView === 'day' || savedView === 'week' || savedView === 'month')) {
      setDefaultCalendarViewState(savedView);
    }
  }, []);

  // Function to update and save the default calendar view
  const setDefaultCalendarView = (view: DefaultCalendarView) => {
    localStorage.setItem('defaultCalendarView', view);
    setDefaultCalendarViewState(view);
  };

  return {
    defaultCalendarView,
    setDefaultCalendarView
  };
}
