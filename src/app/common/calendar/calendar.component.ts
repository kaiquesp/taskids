import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalendarModalComponent } from '../calendarmodal/calendarmodal.component';
import { ModalService } from '../modal/modal.service';
import { CalendarDay } from './calendarday';
import { ChunkPipe } from './chuckpipe';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../api/api.service';
import { Reminder } from '../../interfaces/reminder';
import { Weather } from '../../interfaces/weather';

@Component({
  standalone: true,
  selector: 'app-calendar',
  styleUrl: './calendar.component.scss',
  templateUrl: './calendar.component.html',
  providers: [ApiService],
  imports: [CommonModule, ChunkPipe, CalendarModalComponent, CalendarComponent, HttpClientModule],
})
export class CalendarComponent implements OnInit {
  public calendar: CalendarDay[] = [];
  public monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  public weekNames = [
    'Seg',
    'Ter',
    'Qua',
    'Qui',
    'Sex',
    'Sáb',
    'Dom',
  ];
  public displayYear?: string;
  public displayMonth?: string;
  public selectedDay?: string;
  public selectedWeek?: string;
  public selectedYear?: string;
  public selectedMonth?: string;

  public reminderTime: string = '';
  public reminderColor: string = '';
  public reminderTitle: string = '';
  public reminderCityName: string = '';
  public reminderDescription: string = '';

  public showWeather?: boolean;
  public weather: Weather = {} as Weather;

  private selectedDate?: Date;
  private monthIndex: number = 0;
  private remindersMap: Map<string, Reminder[]> = new Map();

  @Output() dateResponse = new EventEmitter();

  constructor(
    private modalService: ModalService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.generateCalendarDays(this.monthIndex);
  }

  private generateCalendarDays(monthIndex: number): void {
    const newCalendar: CalendarDay[] = [];
    const day: Date = new Date(
      new Date().setMonth(new Date().getMonth() + monthIndex)
    );
    this.displayYear = String(day.getFullYear());
    this.displayMonth = this.monthNames[day.getMonth()];
    let dateToAdd = this.getStartDateForCalendar(day);

    for (let i = 0; i < 42; i++) {
      const calendarday = new CalendarDay();
      calendarday.addDate(new Date(dateToAdd));

      // Retrieve any existing reminders for the date
      const dateString = calendarday.getDateString();
      calendarday.reminders = this.remindersMap.get(dateString) || [];

      newCalendar.push(calendarday);
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }

    this.calendar = newCalendar;
  }

  private getStartDateForCalendar(selectedDate: Date) {
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;

    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(
          startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1)
        );
      } while (startingDateOfCalendar.getDay() != 1);
    }

    return startingDateOfCalendar;
  }

  public clearForm() {
    this.reminderTime = '';
    this.reminderColor = '';
    this.reminderTitle = '';
    this.showWeather = false;
    this.reminderCityName = '';
    this.weather = {} as Weather;
    this.reminderDescription = '';
  }

  public increaseMonth() {
    this.monthIndex++;
    this.generateCalendarDays(this.monthIndex);
  }

  public decreaseMonth() {
    this.monthIndex--;
    this.generateCalendarDays(this.monthIndex);
  }

  public setCurrentMonth() {
    this.monthIndex = 0;
    this.generateCalendarDays(this.monthIndex);
  }

  getDate(date: Date){
    this.dateResponse.emit(date)
  }

  public openModal(date: Date): void {
    this.selectedDate = date;
    this.selectedDay = String(date.getDate());
    this.selectedYear = String(date.getUTCFullYear());
    this.selectedWeek = this.weekNames[date.getDay() - 1];
    this.selectedMonth = this.monthNames[date.getMonth()];
    this.modalService.open(String(date));
  }

  public handleSave(formData: string) {
    const form = {
      ...JSON.parse(formData),
      id: Date.now().toString(),
    } as Reminder;

    if (this.selectedDate) {
      const day = this.calendar.find(
        (day) => day.date?.toDateString() === this.selectedDate?.toDateString()
      );
      if (day) {
        const dateString = day.getDateString();
        const currentReminders = this.remindersMap.get(dateString) || [];
        const existingReminderIndex = currentReminders.findIndex(
          (reminder) => reminder.id === form.id
        );

        if (existingReminderIndex === -1) {
          currentReminders.push(form);
          this.remindersMap.set(dateString, currentReminders);
          day.addReminder(form);
        } else {
          currentReminders[existingReminderIndex] = form;
          this.remindersMap.set(dateString, currentReminders);
          day.reminders[existingReminderIndex] = form;
        }

        this.modalService.close(String(day.date));
      }
      this.clearForm();
    }
  }
}
