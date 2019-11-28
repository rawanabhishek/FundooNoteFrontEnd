import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
  name: 'datetime'
})
export class DatetimePipe implements PipeTransform {

  transform(value: string) {
    const datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'M/d/yy, h:mm a');
    return value;
  }

}
