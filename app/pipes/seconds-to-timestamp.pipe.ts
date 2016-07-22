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
        return hours + ":" + minutes + ":" + seconds;
    }
}