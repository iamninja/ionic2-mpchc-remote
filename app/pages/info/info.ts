import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';

@Component({
    templateUrl: 'build/pages/info/info.html'
})
export class InfoPage {
    constructor(private navController: NavController) { }

    goToSettings() {
        this.navController.push(SettingsPage);
    }
}
