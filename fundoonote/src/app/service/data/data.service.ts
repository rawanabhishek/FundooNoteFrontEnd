import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private noteSource = new BehaviorSubject<any>(null);
  private labelSource = new BehaviorSubject<any>(null);
  private screenSource = new BehaviorSubject<any>('home');

  currentNote = this.noteSource.asObservable();
  currentLabel = this.labelSource.asObservable();
  currentScreen = this.screenSource.asObservable();

  constructor() { }

  changeNotes(note: any) {
    this.noteSource.next(note);
  }

  changeLabel(label: any) {
    this.labelSource.next(label);
  }

  changeScreen(screen: string): void {


    this.screenSource.next(screen);

  }


}
