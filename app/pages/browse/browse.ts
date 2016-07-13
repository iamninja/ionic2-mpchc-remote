import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';

@Component({
    templateUrl: 'build/pages/browse/browse.html'
})
export class BrowsePage {
    constructor(private navController: NavController) { }

    goToSettings() {
        this.navController.push(SettingsPage);
    }
}
