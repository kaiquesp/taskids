import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, model, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { CalendarComponent } from '../../common/calendar/calendar.component';
import { ApiService } from '../api/api.service';
import { ITask } from '../interfaces/tasks';
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CurrencyPipe, CalendarComponent, FormsModule, ReactiveFormsModule, NgClass, AsyncPipe, HeaderComponent],
  providers: [ApiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class HomeComponent implements OnInit {
  selected = model<Date | null>(null);
  dataSource: any
  tasks$: Observable<ITask[]>;
  value$: Observable<any>;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) {
    this.value$ = this.apiService.loadValueTotal()
    this.tasks$ = this.apiService.getTasksItems()
  }

  ngOnInit(): void {
    this.apiService.getTasks(new Date())
  }

  dateResponse(date: Date) {
    this.apiService.getTasks(date)
  }


  isSelected(id: number) {
    console.log(id);
  }
}
