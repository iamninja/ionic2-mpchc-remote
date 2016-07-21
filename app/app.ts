import { Component } from '@angular/core';
import { Platform, ionicBootstrap, NavController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { TabsPage } from './pages/tabs/tabs';
import { MpchcService } from './services/mpchc.service';
import { MALService } from './services/mal.service';
import { SettingsService } from './services/settings.service';


@Component({
  templateUrl: 'build/app.html',
  providers: [
      MpchcService,
      MALService,
      SettingsService
  ]
})
export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp)
