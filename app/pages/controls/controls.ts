import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { MpchcService } from '../../services/mpchc.service';

@Component({
    templateUrl: 'build/pages/controls/controls.html'
})
export class ControlsPage {
    constructor(
        private navController: NavController,
        private mpchcService: MpchcService) {
    }

    basicCommand(command: string) {
        this.mpchcService.basicCommand(command)
        .then(() => console.log("Good"))
        .catch((err) => console.log(err));
    }

    goToSettings() {
        this.navController.push(SettingsPage);
    }
}
