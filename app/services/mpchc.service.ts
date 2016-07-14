import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { SettingsService } from './settings.service';

@Injectable()
export class MpchcService {
    private mpchcUrl: string;
    private mpchcCommandUrl: string;
    private mpchcVariablesUrl: string;

    private headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
    });

    constructor(private http: Http,
                private settingsService: SettingsService) {
        this.http = http;
        this.setUrls();
    }

    basicCommand(command: string): Promise<any> {
        this.setUrls();
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

    checkConfiguration(): Promise<any> {
        this.setUrls();
        return this.http.get(this.mpchcVariablesUrl)
            .toPromise()
            .then(() => 'Connected')
            .catch(() => 'Couldn\'t connect with this configuration');
    }

    private createParams(commandCode: string = '-2',
                         extra_name: string = 'null', 
                         extra_value: string = '0'): URLSearchParams {
        let params = new URLSearchParams();
        params.append('wm_command', commandCode);
        params.append(extra_name, extra_value);
        console.log(params);
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

    private setUrls() {
        let configuration: any;
        this.settingsService.getValue('configuration')
            .then((value) => {
                console.log('value: ' + value['ipAddress']);
                this.mpchcUrl = 'http://' + value['ipAddress'];
                if (value['port'] === undefined) {
                    this.mpchcUrl += ':' + '13579';
                } else {
                    this.mpchcUrl += ':' + value['port'];
                }
                this.mpchcCommandUrl = this.mpchcUrl + '/command.html';
                this.mpchcVariablesUrl = this.mpchcUrl + '/variables.html';
            })
            .catch((error) => {
                console.log(error);
            });
    }
}