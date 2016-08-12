import { Component } from '@angular/core';
import { NavController, Toast } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { SettingsPage } from '../settings/settings';
import { MpchcService } from '../../services/mpchc.service';
import { HummingbirdService } from '../../services/hummingbird.service';

import { HummingbirdAnime } from '../../models/hummingbird-anime.model';
import { HummingbirdAnimeEpisode } from '../../models/hummingbird-anime-episode.model';

@Component({
    templateUrl: 'build/pages/info/info.html'
})
export class InfoPage {

    public title: string;
    public episode: string;
    public id: number;

    public currentlyPlaying: HummingbirdAnime;
    public currentlyPlayingEpisode: HummingbirdAnimeEpisode;
    constructor(
            private navController: NavController,
            private mpchcService: MpchcService,
            private hummingbirdService: HummingbirdService) { 
        
        // this.currentlyPlaying = new HummingbirdAnime();
    }

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
            });
            Observable.interval(10000)
            .mergeMap(() => this.mpchcService.getVariables()
                            .then(() => {
                                this.title = this.mpchcService.titleAndEpisode.title;
                                this.episode = this.mpchcService.titleAndEpisode.episode;
                            })
                            .catch((err) => {
                                this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')');
                            }))
            .mergeMap(() => this.hummingbirdService.getCurrentlyPlayingID(this.title))
            .subscribe(
                (id) => {
                    this.id = id;
                    this.hummingbirdService.getAnimeObjectV2(id)
                        .subscribe((res) => {
                            this.currentlyPlaying = res;
                            console.log(this.currentlyPlaying);
                            this.currentlyPlayingEpisode = this.hummingbirdService.getAnimeEpisodeFromEpisodes(parseInt(this.episode), this.currentlyPlaying.linked.episodes);
                        },
                        (error) => {
                            this.showToast('Couldn\'t find anime. (' + <any>error + ')');
                        })
                },
                (err) => {
                    this.showToast('Couldn\'t find anime. (' + <any>err + ')');
                }
            );
    }

    generateArray(obj){
        return Object.keys(obj).map((key)=>{ return obj[key] });
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
