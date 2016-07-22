import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timestampToSeconds'
})
export class TimestampToSecondsPipe implements PipeTransform {
    transform(timestamp: string) {
        let numbers = timestamp.match(/\d+/g);
        let seconds = 0;
        seconds += parseInt(numbers[2]);
        seconds += (60 * parseInt(numbers[1]));
        seconds += (60 * 60 * parseInt(numbers[0]));
        return seconds;
    }
}