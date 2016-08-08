import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { NavController, Toast } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { SettingsService } from '../../services/settings.service';
import { MpchcService } from '../../services/mpchc.service';


@Component({
    templateUrl: 'build/pages/controls/controls.html'
})
export class ControlsPage {
    private volumeData: Observable<any>;
    private volumeObserver: MutationObserver;
    private smartSkipSeconds: number;
    private volume: string;

    constructor(
            private http: Http,
            private navController: NavController,
            private mpchcService: MpchcService,
            private settingsService: SettingsService) {
        this.volumeData = new Observable(observer => this.volumeObserver = observer);
    }

     onPageWillEnter() {
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
                        this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')');
                    });
            })
            .catch((err) => {
                console.log(err);
            })
        
    }

    changeVolume(volume: string) {
        // this.mpchcService.customCommand('-2', 'volume', volume)
        //     .then((response) => response)
        //     .catch((err) => console.log(err));
        this.http.get(this.mpchcService.mpchcCommandUrl + '?wm_command=-2&volume=' + volume)
            .map((response) => {

            })
            .subscribe(result => {
               
            }, err => { console.log('failed'); });
    }

    smartSkip() {
        this.mpchcService.smartSkip();
    }

    basicCommand(command: string) {
        this.mpchcService.basicCommand(command)
            .then(() => console.log("Good"))
            .catch((err) => {
                this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')'); 
            });
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
