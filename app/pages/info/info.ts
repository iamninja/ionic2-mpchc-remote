import { Component, OnDestroy } from '@angular/core';
import { NavController, Toast } from 'ionic-angular';
import { Observable } from 'rxjs/Rx';

import { SettingsPage } from '../settings/settings';
import { MpchcService } from '../../services/mpchc.service';
import { HummingbirdService } from '../../services/hummingbird.service';

import { HummingbirdAnime } from '../../models/hummingbird-anime.model';
import { HummingbirdAnimeEpisode } from '../../models/hummingbird-anime-episode.model';

export interface MpchcVariables {
    state: number;
    volumeLevel: string;
    timeString: string;
    durationString: string;
    file: string;
    connected: boolean;
}

@Component({
    templateUrl: 'build/pages/info/info.html'
})
export class InfoPage implements OnDestroy {

    public title: string;
    public episode: string;
    public id: number;
    public poll: any;
    public variables: MpchcVariables = {
        state: 0,
        volumeLevel: '',
        timeString: '00:00:00',
        durationString: '00:00:00',
        file: '',
        connected: false
    };
    public currentlyPlaying: HummingbirdAnime;
    public currentlyPlayingEpisode: HummingbirdAnimeEpisode;

    constructor(
            private navController: NavController,
            private mpchcService: MpchcService,
            private hummingbirdService: HummingbirdService) { 
        
        // this.currentlyPlaying = new HummingbirdAnime();
    }

    ngOnDestroy() {
        if (this.poll) {
            this.poll.unsubscribe();
        }
    }

    ionViewWillEnter() {
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
            this.poll = Observable.interval(10000)
            .mergeMap(() => this.mpchcService.getVariables()
                            .then((response) => {
                                if (response.status != 200) {
                                    this.variables.connected = false;
                                }
                                this.variables = this.mpchcService.variables;
                                this.title = this.mpchcService.titleAndEpisode.title;
                                this.episode = this.mpchcService.titleAndEpisode.episode;
                            })
                            .catch((err) => {
                                this.variables.connected = false;
                                this.showToast('Couldn\'t connect to MPC-HC. (' + <any>err + ')');
                            }))
            .skipWhile(() => !this.mpchcService.variables.connected)
            .mergeMap(() => this.hummingbirdService.getCurrentlyPlayingID(this.title))
            .subscribe(
                (id) => {
                    this.id = id;
                    if (this.variables.connected) {
                        this.hummingbirdService.getAnimeObjectV2(id)
                        .subscribe((res) => {
                            this.currentlyPlaying = res;
                            console.log(this.currentlyPlaying);
                            this.currentlyPlayingEpisode = this.hummingbirdService.getAnimeEpisodeFromEpisodes(parseInt(this.episode), this.currentlyPlaying.linked.episodes);
                        },
                        (error) => {
                            this.showToast('Couldn\'t find anime. (' + <any>error + ')');
                        });
                    };
                    
                },
                (err) => {
                    this.variables.connected = false;
                    this.showToast('Couldn\'t connect. (' + <any>err + ')');
                }
            );
    }

    ionViewWillLeave() {
        this.poll.unsubscribe();
    }

    ionViewWillUnload() {
        this.poll.unsubscribe();
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
