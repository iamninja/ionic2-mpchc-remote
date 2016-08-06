import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { SettingsService } from './settings.service';

export interface MALUser {
    username: string;
    password: string;
    valid: boolean;
}

@Injectable()
export class MALService {
    private malUrl = 'http://myanimelist.net/api/';
    public user: MALUser = {
        username: '',
        password: '',
        valid: false
    }

    constructor(private http: Http,
                private settingsService: SettingsService) {
        this.http = http;
    }

    checkCredentials(username = this.user.username, password = this.user.password) {
        let headers = this.createAuthorizationHeader(username, password);
        console.log(headers);
        let checkUrl = this.malUrl + 'account/verify_credentials.xml';
        return this.http.get(checkUrl, {
            headers: headers
        })
        .toPromise()
        .then((response) => {
            if (response.status == 200) {
                this.user.valid = true;
                return 'Connected as, ' + username;
            } else {
                this.user.valid = false;
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
                this.user.username = value['username'];
                this.user.password = value['password'];
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