import { Component } from '@angular/core';
import { NavController, Page, Toast } from 'ionic-angular';

import { SettingsService } from '../../services/settings.service';
import { MpchcService } from '../../services/mpchc.service';

@Component({
  templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsPage {
    private ipAddress: string;
    private port: number;

    constructor(private navController: NavController,
                public settingsService: SettingsService,
                private mpchcService: MpchcService) {
    }

    onPageWillEnter() {
        this.settingsService.getValue('configuration')
            .then((value) => {
                console.log(value);
                this.ipAddress = value['ipAddress'];
                this.port = value['port'];
            })
            .catch((error) => {
                console.log(error);
            });
    }

    saveConfiguration() {
        let configuration = {
            'ipAddress': this.ipAddress,
            'port': this.port
        };
        this.settingsService.setValue('configuration', configuration)
            .then((value) => { 
                this.showToast('Configuration updated.');
                this.mpchcService.checkConfiguration()
                    .then((msg) => this.showToast(msg))
                    .catch((msg) => this.showToast(msg));
            })
            .catch((error) => {
                this.showToast('Unable to save configuration.');
                console.log(error);
            });
    }

    showToast(message: string) {
        let toast = Toast.create({
            message: message,
            duration: 3000
        });

        this.navController.present(toast);
    }
}