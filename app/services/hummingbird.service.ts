import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { SettingsService } from './settings.service';
import { HummingbirdAnime } from '../models/hummingbird-anime.model';
import { HummingbirdAnimeEpisode } from '../models/hummingbird-anime-episode.model';
import { HummingbirdGalleryImage } from '../models/hummingbird-gallery-image.model';
import { CurrentlyPlayingEpisode } from '../models/currently-playing-episode.model';

export class CurrentlyPlaying {
    id: number;
    anime: any;
    episode: any;

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

    getCurrentlyPlayingID(title: string): Observable<number> {
        return this.http.get(this.urlV1 + '/search/anime' + '?query=' + title)
            .map((response) => {
                let distances: number[] = [];
                response.json().forEach((anime, i) => {                    
                    distances[i] = this.levenshtein(title, anime.title);                    
                });
                let minimumDistanceIndex = distances.reduce((indexMin, x, i, arr) => x < arr[indexMin] ? i : indexMin, 0);
                response = response.json();
                return parseInt(response[minimumDistanceIndex].id);
            })
            .catch((err, caught) => this.handleError(err));
    }

    getAnimeEpisodeFromEpisodes(episode_number: number, episodes: any): HummingbirdAnimeEpisode {
        let resultEpisode = new HummingbirdAnimeEpisode();
        episodes.forEach((episode) => {
            if (episode.number == episode_number) {
                resultEpisode = episode as HummingbirdAnimeEpisode;
                return 0;
            }
        });
        return resultEpisode;
    }

    getAnimeObjectV2(id: number): Observable<HummingbirdAnime> {
        return this.http.get(this.urlV2 + '/anime/' + id, {
            headers: this.headersV2
        })
        .map((res) => this.handleResponse(res))
        .catch((err) => this.handleError(err));
    }

    private levenshtein(s: string, t: string): number {

        // Trivial cases
        if (s == t) {
            return 0;
        }
        if (s.length == 0) {
            return t.length;
        }
        if (t.length == 0) {
            return s.length;
        }

        // Distance arrays
        let d1: number[] = [];
        let d2: number[] = [];

        // Initialization
        for (var i = 0; i < t.length + 1; i++) {
            d1[i] = i;            
        }

        for (var i = 0; i < s.length; i++) {
            d2[0] = i + 1; 
            for (var j = 0; j < t.length; j++) {
                var cost = (s[i] == t[j]) ? 0 : 1;
                d2[j + 1] = Math.min(d2[j] + 1, d1[j + 1] + 1, d1[j] + cost);
            }

            for (var j = 0; j < t.length + 1; j++) {
                d1[j] = d2[j]
                
            }
        }
        return d2[t.length];
    }

    private handleResponse(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}