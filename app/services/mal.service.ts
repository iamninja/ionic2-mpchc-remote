import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { SettingsService } from './settings.service';

@Injectable()
export class MALService {
    private malUrl = 'http://myanimelist.net/api/';
    private username: string;
    private password: string;

    constructor(private http: Http,
                private settingsService: SettingsService) {
        this.http = http;
    }

    checkCredentials(username = this.username, password = this.password) {
        let headers = this.createAuthorizationHeader(username, password);
        console.log(headers);
        let checkUrl = this.malUrl + 'account/verify_credentials.xml';
        return this.http.get(checkUrl, {
            headers: headers
        })
        .toPromise()
        .then((response) => {
            if (response.status == 200) {
                return 'Connected as, ' + username;
            } else {
                return 'Couldn\'t connect.';
            }
        })
        .catch((err) => {
            return 'Connection error: ' + err;
        })

    }

    public setCredentials() {
        let malConfiguration: any;
        this.settingsService.getValue('malConfiguration')
            .then((value) => {
                console.log('value: ' + value['username']);
                this.username = value['username'];
                this.password = value['password'];
            })
            .catch((error) => {
                console.log(error);
            });
    }

    private createAuthorizationHeader(username, password) {
        this.setCredentials();
        let headers = new Headers();        
        headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
        return headers;
    }
}