import { Component } from '@angular/core';
import { NavController, Toast } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { MpchcService } from '../../services/mpchc.service';
import { HummingbirdService } from '../../services/hummingbird.service';

@Component({
    templateUrl: 'build/pages/info/info.html'
})
export class InfoPage {
    public title: string;
    public episode: string;
    public id: number;
    public currentlyPlaying = {
        id: 0,
        anime: {
            anime: {}
        }
    };

    constructor(
        private navController: NavController,
        private mpchcService: MpchcService,
        private hummingbirdService: HummingbirdService) { }

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
        this.hummingbirdService.getCurrentlyPlayingID('bleach')
            .then((id) => {
                this.id = id;
                this.hummingbirdService.getAnimeObject(id)
                    .then(() => {
                        this.currentlyPlaying = this.hummingbirdService.currentlyPlaying;
                    })
                    .catch((err) => this.showToast('Couldn\'t find anime. (' + <any>err + ')'))
            })
            .then((err) => {
                this.showToast('Couldn\'t find anime. (' + <any>err + ')');
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
