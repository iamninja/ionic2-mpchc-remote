import { Component } from '@angular/core';
import { NavController, Page, Toast } from 'ionic-angular';

import { SettingsService } from '../../services/settings.service';
import { MpchcService } from '../../services/mpchc.service';
import { MALService } from '../../services/mal.service';

@Component({
  templateUrl: 'build/pages/settings/settings.html'
})
export class SettingsPage {
    private ipAddress: string;
    private port: number;
    private smartSkip: number;
    private malUsername: string;
    private malPassword: string;
    private hummUsername: string;
    private hummPassword: string;

    constructor(private navController: NavController,
                public settingsService: SettingsService,
                private mpchcService: MpchcService,
                private malService: MALService) {
    }

    onPageWillEnter() {
        this.settingsService.getValue('configuration')
            .then((value) => {
                console.log(value);
                this.ipAddress = value['ipAddress'] || "192.168.1.1";
                this.port = value['port'] || "13579";
                this.smartSkip = value['smartSkip'] || "89";
            })
            .catch((error) => {
                console.log(error);
            });
        this.settingsService.getValue('malConfiguration')
            .then((value) => {
                console.log(value);
                this.malUsername = value['username'];
                this.malPassword = value['password'];
            })
            .catch((error) => {
                console.log(error);
            });
        this.settingsService.getValue('hummConfiguration')
            .then((value) => {
                console.log(value);
                this.hummUsername = value['username'];
                this.hummPassword = value['password'];
            })
            .catch((error) => {
                console.log(error);
            });
    }

    saveConfiguration() {
        let configuration = {
            'ipAddress': this.ipAddress,
            'port': this.port,
            'smartSkip': this.smartSkip
        };
        this.settingsService.setValue('configuration', configuration)
            .then((value) => { 
                this.showToast('Configuration updated.');
                this.mpchcService.checkConfiguration()
                    .then((msg) => {
                        console.log("1" + msg);
                        this.showToast(msg);
                    })
                    .catch((msg) => {
                        console.log("2");
                        this.showToast(msg);
                    });
            })
            .catch((error) => {
                this.showToast('Unable to save configuration.');
                console.log(error);
            });
    }

    saveMAL() {
        let malConfiguration = {
            'username': this.malUsername,
            'password': this.malPassword
        };
        this.settingsService.setValue('malConfiguration', malConfiguration)
            .then((value) => { 
                this.showToast('Configuration updated.');
                this.malService.setCredentials();
                this.malService.checkCredentials(this.malUsername, this.malPassword)
                    .then((msg) => this.showToast(msg))
                    .catch((msg) => this.showToast(msg));
            })
            .catch((error) => {
                this.showToast('Unable to save configuration.');
                console.log(error);
            });
    }

    saveHUMM() {
        let hummConfiguration = {
            'username': this.hummUsername,
            'password': this.hummPassword
        };
        this.settingsService.setValue('hummConfiguration', hummConfiguration)
            .then((value) => { 
                this.showToast('Configuration updated.');
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