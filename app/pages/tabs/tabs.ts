import {Component} from '@angular/core'
import {InfoPage} from '../info/info';
import {ControlsPage} from '../controls/controls';
import {BrowsePage} from '../browse/browse';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private infoTab: any;
  private controlsTab: any;
  private browseTab: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.infoTab = InfoPage;
    this.controlsTab = ControlsPage;
    this.browseTab = BrowsePage;
  }
}
