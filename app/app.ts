import { Component } from '@angular/core';
import { Platform, ionicBootstrap, NavController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import './rxjs-operators';

import { TabsPage } from './pages/tabs/tabs';
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
