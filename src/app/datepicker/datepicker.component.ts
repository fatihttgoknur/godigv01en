import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, signal } from '@angular/core';
import {MatDatepickerModule, MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter, DateAdapter, MAT_DATE_LOCALE} from '@angular/material/core';

@Component({
  selector: 'app-datepicker',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'tr-TR'}],
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css'
})
export class DatepickerComponent {
  @Input({transform: myTransformFunction, required: false}) fInput: string | undefined;

  @Output() selectedDate = new EventEmitter<Date>();

  pickedDate: Date = new Date();

  dateChanged(type: string, event: MatDatepickerInputEvent<Date>) {
    if (event.value) this.pickedDate = event.value;
    this.pickChanged();
  }

  pickChanged() {
    this.selectedDate.emit(this.pickedDate);
  }
}

function myTransformFunction(value: string | undefined): Date | undefined {
  try {
    if (!value) {
      console.log("Program error. Input tranform failed.");
      return;
    }

    let myDate = new Date(value);

    if (isNaN(myDate.getTime())) {
      console.log("Program error. Input tranform failed.");
      return;
    }

    return myDate;

  } catch (err) {
    console.log("Program error. Input tranform failed. ", err);
    return;
  }
}
