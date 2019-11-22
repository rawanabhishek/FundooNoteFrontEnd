import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private noteSource = new BehaviorSubject<any>('default message');
  private labelSource = new BehaviorSubject<any>('default message');
  currentNote = this.noteSource.asObservable();
  currentLabel = this.labelSource.asObservable();

  constructor() { }

  changeNotes(note: any) {
    this.noteSource.next(note);
  }

  changeLabel(label: any) {
    this.labelSource.next(label);
  }


}
