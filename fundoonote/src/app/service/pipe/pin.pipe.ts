import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pin'
})
export class PinPipe implements PipeTransform {

  transform(notes: any, pin: boolean): any {
    if (notes == null) {
      return null;
    }

    return notes.filter(i => i.pin === pin);
  }

}
