import { Component } from '@angular/core';
import { NavController, Toast } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { SettingsService } from '../../services/settings.service';
import { MpchcService } from '../../services/mpchc.service';


@Component({
    templateUrl: 'build/pages/controls/controls.html'
})
export class ControlsPage {
    private smartSkipSeconds: number;

    constructor(
        private navController: NavController,
        private mpchcService: MpchcService,
        private settingsService: SettingsService) {
    }

     onPageWillEnter() {
        this.settingsService.getValue('configuration')
            .then((value) => {
                console.log(value);
                this.smartSkipSeconds = value['smartSkip'];
            })
            .catch((error) => {
                console.log(error);
            });
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
