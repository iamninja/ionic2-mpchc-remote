import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { SettingsService } from './settings.service';
import { SecondsToTimestampPipe } from '../pipes/seconds-to-timestamp.pipe';
import { TimestampToSecondsPipe } from '../pipes/timestamp-to-seconds.pipe';

export interface MpchcVariables {
    state: number;
    volumeLevel: string;
    timeString: string;
    durationString: string;
    file: string;
    connected: boolean;
}

export interface TitleAndEpisode {
    title: string;
    episode: string;
}

@Injectable()
export class MpchcService {
    public mpchcUrl: string;
    public mpchcCommandUrl: string;
    public mpchcVariablesUrl: string;

    public smartSkipSeconds: string;
    public variables: MpchcVariables = {
        state: 0,
        volumeLevel: '',
        timeString: '00:00:00',
        durationString: '00:00:00',
        file: '',
        connected: false
    };
    public titleAndEpisode: TitleAndEpisode = {
        title: '',
        episode: ''
    };

    private headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
    });

    constructor(private http: Http,
                private settingsService: SettingsService,
                private timestampToSeconds: TimestampToSecondsPipe,
                private secondsToTimestamp: SecondsToTimestampPipe) {
        this.http = http;
        this.timestampToSeconds = timestampToSeconds;
        this.secondsToTimestamp = secondsToTimestamp;
        this.setUrls();
    }

    basicCommand(command: string): Promise<any> {
        this.setUrls()
        .then()
        .catch();
        let commandCode = this.getCommandCode(command);
        let params = this.createParams(commandCode);
        let options: RequestOptionsArgs = ({
            url: this.mpchcCommandUrl, 
            headers: this.headers,
            search: params
        });
        console.log(options);
        return this.http.get(this.mpchcCommandUrl, options)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
    }

    customCommand(command: string, name: string, value: string): Promise<any> {
        let params = this.createParams(command, name, value);
        let options: RequestOptionsArgs = ({
            url: this.mpchcCommandUrl,
            headers: this.headers,
            search: params
        });
        return this.http.get(this.mpchcCommandUrl, options)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError)
    }

     smartSkip() {
        this.http.get(this.mpchcVariablesUrl)
            .toPromise()
            .then((response) => {
                // Create the timestamp for the new position
                let parser = new DOMParser();
                let doc  = parser.parseFromString(response.text(), 'text/html');
                let timestamp = doc.querySelectorAll('#positionstring')[0].textContent;
                let seconds = this.timestampToSeconds.transform(timestamp);
                seconds = seconds + parseInt(this.smartSkipSeconds);                
                timestamp = this.secondsToTimestamp.transform(seconds);
                // Make the skip
                this.customCommand('-1', 'position', timestamp)
                    .then(() => 'skipped')
                    .catch(() => 'failed to skip');
            
            })
            .catch((err) => {
                return 'Couldn\'t connect to server: ' + err;
            })

    }

    updateVolume(volume: string) {
        let params = this.createParams('-2', 'volume', volume);
        let options: RequestOptionsArgs = ({
            url: this.mpchcCommandUrl,
            headers: this.headers,
            search: params
        });
        return this.http
            .post(this.mpchcCommandUrl, options)
            .toPromise()
            .then((response) => this.handleResponse)
            .catch((err) => this.handleError)
    }


    checkConfiguration(): Promise<any> {
        return this.setUrls()
            .then(() => {
                this.http.get(this.mpchcVariablesUrl)
                    .toPromise()
                    .then((res) => {                        
                        return 'Connected';
                    })
                    .catch((err) => {                        
                        return 'Couldn\'t connect with this configuration';
                    });
            })
            .catch(() => {
                return 'Couldn\'t connect';
            })
    }

    getVariables(): Promise<any> {
        return this.http.get(this.mpchcVariablesUrl)
            .toPromise()
            .then((response) => {
                if (response.status != 200) {
                    this.variables.connected = false;
                    return response;
                }
                this.variables.connected = true;
                let parser = new DOMParser();
                let doc = parser.parseFromString(response.text(), 'text/html');

                this.variables.state = parseInt(doc.querySelectorAll('#state')[0].textContent);
                this.variables.volumeLevel = doc.querySelectorAll('#volumelevel')[0].textContent;                        
                this.variables.timeString = doc.querySelectorAll('#positionstring')[0].textContent;
                this.variables.durationString = doc.querySelectorAll('#durationstring')[0].textContent;                        
                this.variables.file = doc.querySelectorAll('#file')[0].textContent;
                this.setTitleAndEpisode(this.variables.file);
                console.log(this.titleAndEpisode);
                return response;    
            })
            .catch((err) => {
                this.variables.connected = false;
                console.log('cant connect');
                return err;
                // return 'Couldn\'t connect with this configuration'
            })
    }

    setUrls(): Promise<any> {
        let configuration: any;
        return this.settingsService.getValue('configuration')
            .then((value) => {
                // console.log('value: ' + value['ipAddress']);
                this.mpchcUrl = 'http://' + value['ipAddress'];
                if (value['port'] === undefined) {
                    this.mpchcUrl += ':' + '13579';
                } else {
                    this.mpchcUrl += ':' + value['port'];
                }
                this.mpchcCommandUrl = this.mpchcUrl + '/command.html';
                this.mpchcVariablesUrl = this.mpchcUrl + '/variables.html';
                this.smartSkipSeconds = value['smartSkip'];
            })
            .catch((error) => {
                console.log(error);
            });
    }

    setTitleAndEpisode(filename: string) {
        filename = filename.replace(/(\[.*?\]|\(.*?\)) */g, "");
        filename = filename.substr(0, filename.lastIndexOf('.')) || filename;
        filename = filename.replace(/_/g, " ").trim();
        this.titleAndEpisode.title = filename.substr(0, filename.lastIndexOf('-')).trim() || filename;
        this.titleAndEpisode.episode = filename.substr(filename.lastIndexOf('-') + 1, filename.length).trim() || "";
    }

    private createParams(commandCode: string = '-2',
                         extra_name: string = 'null', 
                         extra_value: string = '0'): URLSearchParams {
        let params = new URLSearchParams();
        params.append('wm_command', commandCode);
        params.append(extra_name, extra_value);
        // console.log(params);
        return params;
    }

    private getCommandCode(command: string): string {
        switch (command) {
            case 'play':
                return '887';
            case 'pause':
                return '888';
            case 'stop':
                return '890';
            case 'skipForward':
                return '922';
            case 'skipBackward':
                return '921';
            case 'increaseSpeed':
                return '895';
            case 'decreaseSpeed':
                return '894';
            case 'previousSubtitles':
                return '955';
            case 'nextSubtitles':
                return '954';
            case 'previousAudio':
                return '953';
            case 'nextAudio':
                return '952';
        
            default:
                return '887';
        }
    }

    private handleResponse(res: Response) {
        return true;
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message : 
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.log(errMsg);
        return Promise.reject(errMsg);
    }
}