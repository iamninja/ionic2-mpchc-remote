import { Component, ViewChild } from '@angular/core';
import { Platform, ionicBootstrap, NavController, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import './rxjs-operators';

import { RemoteTabsPage } from './pages/remote-tabs/remote-tabs';
import { SettingsPage } from './pages/settings/settings';
import { MpchcService } from './services/mpchc.service';
import { MALService } from './services/mal.service';
import { HummingbirdService } from './services/hummingbird.service';
import { SettingsService } from './services/settings.service';
import { SecondsToTimestampPipe } from './pipes/seconds-to-timestamp.pipe';
import { TimestampToSecondsPipe } from './pipes/timestamp-to-seconds.pipe';


@Component({
    templateUrl: 'build/app.html',
    providers: [
        MpchcService,
        MALService,
        HummingbirdService,
        SettingsService,
        SecondsToTimestampPipe,
        TimestampToSecondsPipe
    ],
    pipes: [
        SecondsToTimestampPipe,
        TimestampToSecondsPipe
    ]
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    private rootPage: any;
    private pages: any[];

    constructor(private platform: Platform,
                private menuController: MenuController) {
        this.menuController = menuController;
        this.pages = [
            { title: 'Remote', component: RemoteTabsPage },
            { title: 'Settings', component: SettingsPage }
        ];
        this.rootPage = RemoteTabsPage;

        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

    openPage(page) {
        this.menuController.close();
        this.nav.push(page.component);
    }
}

ionicBootstrap(MyApp)
