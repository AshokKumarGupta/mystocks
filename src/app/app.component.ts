import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
 


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(private platform: Platform, public splashScreen: SplashScreen) {
      this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => { 
      // do whatever you need to do here.
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
    });
  }

}

