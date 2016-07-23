import { Component } from '@angular/core';
import { NavController, Toast } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { MpchcService } from '../../services/mpchc.service';

@Component({
    templateUrl: 'build/pages/info/info.html'
})
export class InfoPage {
    public title: string;
    public episode: string;

    constructor(
        private navController: NavController,
        private mpchcService: MpchcService) { }

    onPageWillEnter() {
        this.mpchcService.setUrls()
            .then(() => {
                this.mpchcService.getVariables()
                    .then(() => {                        
                        this.title = this.mpchcService.titleAndEpisode.title;
                        this.episode = this.mpchcService.titleAndEpisode.episode;
                    })
                    .catch((err) => {
                        this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')');
                    });
            })
            .catch((err) => {
                console.log(err);
            })
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
