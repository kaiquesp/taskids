import { CalendarDay } from './calendarday';

describe('CalendarDay', () => {
  let calendarDay: CalendarDay;

  beforeEach(() => {
    calendarDay = new CalendarDay();
  });

  it('should initialize with default values', () => {
    expect(calendarDay.date).toBeUndefined();
    expect(calendarDay.isToday).toBeUndefined();
    expect(calendarDay.isPastDate).toBeUndefined();
    expect(calendarDay.reminders).toEqual([]);
  });

  describe('addDate', () => {
    it('should set the date and check if it is today or past', () => {
      const date = new Date();
      calendarDay.addDate(date);

      // Check if the date is set
      expect(calendarDay.date).toEqual(date);

      // Check if the date is today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(calendarDay.isToday).toBe(date.setHours(0, 0, 0, 0) === today.getTime());

      // Check if the date is past
      expect(calendarDay.isPastDate).toBe(date.getTime() < today.getTime());
    });
  });

  // describe('getDateString', () => {
  //   it('should return the date as a string in YYYY-MM-DD format', () => {
  //     const date = new Date('2024-08-12T00:00:00Z'); // Use ISO format with timezone
  //     calendarDay.addDate(date);

  //     expect(calendarDay.getDateString()).toBe('2024-08-12');
  //   });
  // });
});
