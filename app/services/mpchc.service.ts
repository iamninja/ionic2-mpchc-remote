import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams, RequestOptionsArgs, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MpchcService {
    private mpchcUrl = 'http://localhost:13579/';
    private mpchcCommandUrl = this.mpchcUrl + 'command.html';

    private headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
    });

    constructor(private http: Http) {
        this.http = http;
    }

    basicCommand(command: string): Promise<any> {
        let commandCode = this.getCommandCode(command);
        let params = this.createParams(commandCode);
        let options: RequestOptionsArgs = ({
            url: this.mpchcCommandUrl, 
            headers: this.headers,
            search: params
        });
        return this.http.get(this.mpchcCommandUrl, options)
            .toPromise()
            .then(this.handleResponse)
            .catch(this.handleError);
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
}