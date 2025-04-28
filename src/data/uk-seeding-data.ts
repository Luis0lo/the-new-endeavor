interface SeedingEvent {
  name: string;
  type: 'indoor' | 'outdoor' | 'transplant' | 'harvest';
  startMonth: number; // 0-11 (January is 0)
  endMonth: number; // 0-11
}

export interface PlantSchedule {
  name: string;
  sowIndoors: { startMonth: number; endMonth: number }[];
  sowOutdoors: { startMonth: number; endMonth: number }[];
  plantOutdoors: { startMonth: number; endMonth: number }[];
  harvest: { startMonth: number; endMonth: number }[];
}

// More complete planting calendar data for UK growing
export const ukPlantingCalendar: PlantSchedule[] = [
  {
    name: 'Artichoke (Globe)',
    sowIndoors: [{ startMonth: 1, endMonth: 3 }], // Feb-Apr
    sowOutdoors: [],
    plantOutdoors: [{ startMonth: 4, endMonth: 5 }], // May-Jun
    harvest: [{ startMonth: 6, endMonth: 9 }], // Jul-Oct
  },
  {
    name: 'Artichoke (Jerusalem)',
    sowIndoors: [],
    sowOutdoors: [],
    plantOutdoors: [{ startMonth: 1, endMonth: 2 }], // Feb-Mar
    harvest: [{ startMonth: 0, endMonth: 0 }, { startMonth: 10, endMonth: 11 }], // Jan, Nov-Dec
  },
  {
    name: 'Asparagus',
    sowIndoors: [],
    sowOutdoors: [],
    plantOutdoors: [{ startMonth: 2, endMonth: 3 }], // Mar-Apr
    harvest: [{ startMonth: 3, endMonth: 5 }], // Apr-Jun
  },
  {
    name: 'Aubergine',
    sowIndoors: [{ startMonth: 1, endMonth: 2 }], // Feb-Mar
    sowOutdoors: [],
    plantOutdoors: [{ startMonth: 4, endMonth: 5 }], // May-Jun
    harvest: [{ startMonth: 6, endMonth: 8 }], // Jul-Sep
  },
  {
    name: 'Beetroot',
    sowIndoors: [],
    sowOutdoors: [{ startMonth: 2, endMonth: 5 }], // Mar-Jun
    plantOutdoors: [],
    harvest: [{ startMonth: 5, endMonth: 9 }], // Jun-Oct
  },
  {
    name: 'Bean (Broad)',
    sowIndoors: [{ startMonth: 0, endMonth: 1 }], // Jan-Feb
    sowOutdoors: [{ startMonth: 2, endMonth: 3 }], // Mar-Apr
    plantOutdoors: [{ startMonth: 2, endMonth: 3 }], // Mar-Apr
    harvest: [{ startMonth: 5, endMonth: 8 }, { startMonth: 9, endMonth: 10 }], // Jun-Sep, Oct-Nov
  },
  {
    name: 'Bean (Runner)',
    sowIndoors: [{ startMonth: 3, endMonth: 4 }], // Apr-May
    sowOutdoors: [],
    plantOutdoors: [{ startMonth: 4, endMonth: 5 }], // May-Jun
    harvest: [{ startMonth: 6, endMonth: 9 }], // Jul-Oct
  },
  {
    name: 'Broccoli',
    sowIndoors: [{ startMonth: 2, endMonth: 3 }], // Mar-Apr
    sowOutdoors: [{ startMonth: 2, endMonth: 4 }], // Mar-May
    plantOutdoors: [{ startMonth: 3, endMonth: 4 }], // Apr-May
    harvest: [{ startMonth: 6, endMonth: 9 }], // Jul-Oct
  },
  {
    name: 'Brussels Sprout',
    sowIndoors: [],
    sowOutdoors: [{ startMonth: 2, endMonth: 4 }], // Mar-May
    plantOutdoors: [{ startMonth: 4, endMonth: 5 }], // May-Jun
    harvest: [{ startMonth: 0, endMonth: 2 }, { startMonth: 9, endMonth: 11 }], // Jan-Mar, Oct-Dec
  },
  {
    name: 'Butternut Squash',
    sowIndoors: [{ startMonth: 3, endMonth: 4 }], // Apr-May
    sowOutdoors: [],
    plantOutdoors: [{ startMonth: 5, endMonth: 5 }], // Jun
    harvest: [{ startMonth: 8, endMonth: 9 }], // Sep-Oct
  },
  {
    name: 'Cabbage (Summer)',
    sowIndoors: [{ startMonth: 1, endMonth: 1 }], // Feb
    sowOutdoors: [{ startMonth: 2, endMonth: 3 }], // Mar-Apr
    plantOutdoors: [{ startMonth: 4, endMonth: 5 }], // May-Jun
    harvest: [{ startMonth: 6, endMonth: 9 }], // Jul-Oct
  },
  {
    name: 'Carrot',
    sowIndoors: [],
    sowOutdoors: [{ startMonth: 2, endMonth: 6 }], // Mar-Jul
    plantOutdoors: [],
    harvest: [{ startMonth: 5, endMonth: 9 }], // Jun-Oct
  },
  {
    name: 'Cauliflower',
    sowIndoors: [],
    sowOutdoors: [{ startMonth: 3, endMonth: 5 }], // Apr-Jun
    plantOutdoors: [],
    harvest: [{ startMonth: 7, endMonth: 10 }], // Aug-Nov
  },
  {
    name: 'Chili Pepper',
    sowIndoors: [{ startMonth: 0, endMonth: 3 }], // Jan-Apr
    sowOutdoors: [],
    plantOutdoors: [],
    harvest: [{ startMonth: 6, endMonth: 9 }], // Jul-Oct
  },
  {
    name: 'Courgette',
    sowIndoors: [{ startMonth: 3, endMonth: 4 }], // Apr-May
    sowOutdoors: [{ startMonth: 4, endMonth: 5 }], // May-Jun
    plantOutdoors: [{ startMonth: 5, endMonth: 5 }], // Jun
    harvest: [{ startMonth: 6, endMonth: 9 }], // Jul-Oct
  },
  {
    name: 'Cucumber',
    sowIndoors: [],
    sowOutdoors: [{ startMonth: 3, endMonth: 5 }], // Apr-Jun
    plantOutdoors: [],
    harvest: [{ startMonth: 6, endMonth: 8 }], // Jul-Sep
  },
];

// Keep the original data structure for compatibility with existing code
export const ukSeedingData: SeedingEvent[] = [
  // Common vegetables
  { name: 'Tomatoes', type: 'indoor', startMonth: 1, endMonth: 2 }, // Feb-March
  { name: 'Peppers', type: 'indoor', startMonth: 1, endMonth: 2 }, // Feb-March
  { name: 'Lettuce', type: 'indoor', startMonth: 0, endMonth: 7 }, // Jan-Aug
  { name: 'Peas', type: 'outdoor', startMonth: 2, endMonth: 5 }, // March-June
  { name: 'Carrots', type: 'outdoor', startMonth: 2, endMonth: 6 }, // March-July
  { name: 'Beans', type: 'outdoor', startMonth: 4, endMonth: 6 }, // May-July
  { name: 'Broccoli', type: 'indoor', startMonth: 2, endMonth: 4 }, // March-May
  { name: 'Cabbage', type: 'indoor', startMonth: 2, endMonth: 4 }, // March-May
  { name: 'Spinach', type: 'outdoor', startMonth: 2, endMonth: 8 }, // March-Sept
  { name: 'Onions', type: 'outdoor', startMonth: 2, endMonth: 3 }, // March-April
];

export const getMonthEvents = (date: Date): SeedingEvent[] => {
  const month = date.getMonth();
  return ukSeedingData.filter(
    event => month >= event.startMonth && month <= event.endMonth
  );
};

// Helper functions for the annual view
export const getMonthName = (monthIndex: number): string => {
  return new Date(2023, monthIndex).toLocaleString('default', { month: 'short' }).toUpperCase();
};

export const months = Array.from({ length: 12 }, (_, i) => getMonthName(i));
