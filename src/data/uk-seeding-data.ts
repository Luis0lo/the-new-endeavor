
interface SeedingEvent {
  name: string;
  type: 'indoor' | 'outdoor' | 'transplant';
  startMonth: number; // 0-11 (January is 0)
  endMonth: number; // 0-11
}

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
