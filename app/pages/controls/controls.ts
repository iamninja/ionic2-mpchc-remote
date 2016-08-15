import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NavController, Toast } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { SettingsService } from '../../services/settings.service';
import { MpchcService } from '../../services/mpchc.service';

import { SecondsToTimestampPipe } from '../../pipes/seconds-to-timestamp.pipe';
import { TimestampToSecondsPipe } from '../../pipes/timestamp-to-seconds.pipe';

export interface MpchcVariables {
    state: number;
    volumeLevel: string;
    timeString: string;
    durationString: string;
    file: string;
    connected: boolean;
}

@Component({
    templateUrl: 'build/pages/controls/controls.html',
    pipes: [
        TimestampToSecondsPipe
    ]
})
export class ControlsPage {
    private volumeData: Observable<any>;
    private volumeObserver: MutationObserver;
    private smartSkipSeconds: number;
    private volume: string;
    private poll: any;
    private timer: any;

    public currentSecond: number = 0;

    public variables: MpchcVariables = {
        state: 0,
        volumeLevel: '',
        timeString: '00:00:00',
        durationString: '00:00:00',
        file: '',
        connected: false
    };

    constructor(
            private http: Http,
            private navController: NavController,
            private mpchcService: MpchcService,
            private settingsService: SettingsService,
            private timestampToSeconds: TimestampToSecondsPipe,
            private secondsToTimestamp: SecondsToTimestampPipe) {
        this.volumeData = new Observable(observer => this.volumeObserver = observer);
        this.timestampToSeconds = timestampToSeconds;
        this.secondsToTimestamp = secondsToTimestamp;
    }

    ionViewWillEnter() {
        this.variables = this.mpchcService.variables;
        this.currentSecond = this.timestampToSeconds.transform(this.variables.timeString);
        this.settingsService.getValue('configuration')
            .then((value) => {
                this.smartSkipSeconds = value['smartSkip'];
            })
            .catch((error) => {
                console.log(error);
            });
        this.mpchcService.setUrls()
            .then(() => {
                this.mpchcService.getVariables()
                    .then(() => {
                        this.volume = this.mpchcService.variables.volumeLevel;
                    })
                    .catch((err) => {
                        console.log('looog');
                        
                        this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')');
                    });
            })
            .catch((err) => {
                console.log(err);
            })
        this.poll = Observable.interval(5000)
            .mergeMap(() => this.mpchcService.getVariables()
                            .then((response) => {
                                if (response.status != 200) {
                                    this.variables.connected = false;
                                }
                                
                                this.variables = this.mpchcService.variables;
                            })
                            .catch((err) => {
                                this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')');
                            }))
            .skipWhile(() => !this.mpchcService.variables.connected)
            .subscribe(
                (id) => {
                    if (this.timer) {
                        this.timer.unsubscribe();
                    }
                    this.volume = this.mpchcService.variables.volumeLevel;
                    this.currentSecond = this.timestampToSeconds.transform(this.mpchcService.variables.timeString);
                    if (this.variables.state == 2) {                        
                        this.timer = Observable.timer(1000, 1000)
                            .subscribe((t) => {                                
                                this.incrementTimestamp();
                                this.currentSecond += 1;
                            });
                    }
                },
                (err) => {
                    this.showToast('Couldn\'t find anime. (' + <any>err + ')');
                }
            );
        
    }

    ionViewWillLeave() {
        this.poll.unsubscribe();
        this.timer.unsubscribe();
    }

    changeVolume(volume: string) {
        if (!this.variables.connected) {
            return;
        }
        // this.mpchcService.customCommand('-2', 'volume', volume)
        //     .then((response) => response)
        //     .catch((err) => console.log(err));
        this.http.get(this.mpchcService.mpchcCommandUrl + '?wm_command=-2&volume=' + volume)
            .map((response) => {

            })
            .subscribe(result => {
               
            }, err => { console.log('failed'); });
    }

    changePosition(seconds) {
        if (!this.variables.connected) {
            return;
        }
        let timestamp = this.secondsToTimestamp.transform(seconds);
        this.mpchcService.customCommand('-1', 'position', timestamp)
            .then((response) => {
                this.variables.timeString = timestamp;
            })
            .catch((err) => {
                this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')');
            })
    }

    smartSkip() {
        if (!this.variables.connected) {
            return;
        }
        this.mpchcService.smartSkip();
        this.currentSecond += parseInt(this.mpchcService.smartSkipSeconds);
        this.variables.timeString = this.secondsToTimestamp.transform(this.currentSecond);
    }

    basicCommand(command: string) {
        if (!this.variables.connected) {
            return;
        }
        switch (command) {
            case 'pause':
                this.timer.unsubscribe();
                break;
            case 'stop':
                this.timer.unsubscribe();
                this.currentSecond = 0;
                this.variables.timeString = '00:00:00';
            default:
                break;
        }
        this.mpchcService.basicCommand(command)
            .then(() => console.log("Good"))
            .catch((err) => {
                this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')'); 
            });
    }

    incrementTimestamp() {
        let seconds = this.timestampToSeconds.transform(this.variables.timeString);
        this.variables.timeString = this.secondsToTimestamp.transform(seconds +1);
    }

    goToSettings() {
        this.navController.push(SettingsPage);
    }

    showToast(message: string) {
        let toast = Toast.create({
            message: message,
            duration: 3000
        });

        this.navController.present(toast);
    }
}
