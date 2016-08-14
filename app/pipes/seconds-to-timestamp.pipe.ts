import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secondsToTimestamp'
})
export class SecondsToTimestampPipe implements PipeTransform {
    transform(seconds: number) {
        let hours = Math.floor(seconds / (60 * 60));
        seconds = seconds % (60 * 60);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        return this.pad(hours) + ":" + this.pad(minutes) + ":" + this.pad(seconds);
    }

    pad(number: number): string {
        return (number < 10) ? '0' + number.toString() : number.toString();
    }
}