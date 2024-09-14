import { BehaviorSubject, type Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import type { Weather } from '../interfaces/weather';
import { environment } from '../../environments/environment';
import { ITask } from '../interfaces/tasks';
import { Frequency } from '../enum/frequency.enum';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private taskItem: ITask[] = [];
  private taskItem$ = new BehaviorSubject<ITask[]>(this.taskItem);
  private apiWeatherUrl: string = environment.API_WEATHER_URL;
  private apiWeatherAppID: string = environment.API_WEATHER_APP_ID;
  private items: ITask[] = []
  private days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  constructor(private http: HttpClient) {}

  load(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiWeatherUrl}/tasks.json`)
  }

  loadValueTotal(){
    return this.http.get(`${this.apiWeatherUrl}/value.json`)
  }

  getTasksItems() : Observable<ITask[]> {
    return this.taskItem$.asObservable();
  }

  getTasks(date: Date) {
    if(this.items.length === 0){
      this.load().subscribe((r) => {
        this.items = r
        this.filterTasksOnce(date)
      },(complete:any) => {
        this.getValueforTask()
      })
    } else {
      this.filterTasksOnce(date)
      this.getValueforTask()
    }

  }

  getValueforTask() {
    this.loadValueTotal().subscribe((v:any) => {
      console.log(v.value)
      console.log(this.items.length)
      console.log(v.value / this.items.length)
    })

  }

  filterTasksOnce(date: Date) {
    const retorno = this.items.filter((d: ITask) => {
      return d.frequency === Frequency.ONCE && d.date === date.toLocaleDateString() ||
      d.frequency === Frequency.WEEKLY && this.checkFrenquencyWeekly(d, date) ||
      d.frequency === Frequency.MONTHLY && d.date.split('/')[0].indexOf(date.toLocaleDateString().split('/')[0]) != -1 ||
      d.frequency === Frequency.EVERYDAY
    })

    if(retorno){
      this.taskItem$.next(retorno)
    }
  }

  checkFrenquencyWeekly(tasks: ITask, date: Date) {
    return tasks.frequencyDays.find((day) => {
      return day === this.days[date.getDay()]
    })
  }
}
