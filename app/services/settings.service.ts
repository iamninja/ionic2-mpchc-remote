import { Injectable } from '@angular/core';
import { Storage, SqlStorage } from 'ionic-angular';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class SettingsService {
    private storage: Storage;

    constructor() {
        this.storage = new Storage(SqlStorage);
    }

    setValue(key: string, value: any): Promise<any> {
        return this.storage.setJson(key, value)
            .then((value) => { return JSON.parse(value) })
            .catch((error) => { return error; });
    }

    getValue(key: string): Promise<any> {
        return this.storage.getJson(key)
            .then((value) => {
                return value; 
            })
            .catch((error) => { return error; });
    }    
}