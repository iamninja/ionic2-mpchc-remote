import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';
import { MpchcService } from '../../services/mpchc.service';

@Component({
    templateUrl: 'build/pages/browse/browse.html'
})
export class BrowsePage {
    public browseArray: Array<any>;
    public location: string;

    constructor(private navController: NavController,
                private mpchcService: MpchcService) { }

    ionViewWillEnter() {
        
        this.mpchcService.getDirectory()
            .then((result) => {
                this.browseArray = result;
                this.location = this.browseArray.shift();   
                console.log(this.location);             
            })
            .catch((err) => { });
    }

    goToPath(name: string) {
        let path = this.location + name; 
        console.log(path);
        
        this.mpchcService.getDirectory(path)
            .then((result) => {
                this.browseArray = result;
                this.location = this.browseArray.shift();   
                console.log(this.location);             
            })
            .catch((err) => { });
    }

    goToSettings() {
        this.navController.push(SettingsPage);
    }
}
