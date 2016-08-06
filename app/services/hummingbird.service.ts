import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { SettingsService } from './settings.service';
import { HummingbirdAnime } from '../models/hummingbird-anime.model';
import { HummingbirdAnimeEpisode } from '../models/hummingbird-anime-episode.model';
import { HummingbirdGalleryImage } from '../models/hummingbird-gallery-image.model';
import { CurrentlyPlayingEpisode } from '../models/currently-playing-episode.model';

export class CurrentlyPlaying {
    id: number;
    anime: any;

    constructor(id: number, anime: any) {
        this.id = id;
        this.anime = anime;
    }
}

@Injectable()
export class HummingbirdService {

    private urlV1 = 'http://hummingbird.me/api/v1';
    private urlV2 = 'https://hummingbird.me/api/v2';
    private headersV2 = new Headers({
        'X-Client-Id': 'b222067baa8e9e870108'
    });

    public currentlyPlaying: CurrentlyPlaying;

    constructor(private http: Http,
                private settingsService: SettingsService) {
        this.http = http;
        this.settingsService = settingsService;
    }

    getCurrentlyPlayingID(title: string): Promise<number> {
        return this.http.get(this.urlV1 + '/search/anime' + '?query=' + title)
            .toPromise()
            .then((response) => {
                response = response.json();
                // console.log('id' + response[0]);
                console.log(response[0].id);
                return parseInt(response[0].id);
            })
            .catch((err) => console.log(err));
    }

    getAnimeObject(id: number): Promise<HummingbirdAnime> {
        return this.http.get(this.urlV2 + '/anime/' + id,
            {
                headers: this.headersV2
            })
            .toPromise()
            .then((response) => {
                response = response.json();
                console.log(response);
                this.currentlyPlaying = new CurrentlyPlaying(id, response);
                console.log(this.currentlyPlaying);
                return this.currentlyPlaying;
            })
            .catch((err) => console.log(err));
    }
}