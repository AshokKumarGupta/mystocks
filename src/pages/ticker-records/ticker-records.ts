import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the TickerRecords page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ticker-records',
  templateUrl: 'ticker-records.html',
  providers: [Storage]
})
export class TickerRecordsPage {
  tickerName:string;
  tickerSavedNotes:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,private tickerNotes: Storage) {
    this.tickerName = this.navParams.get('tickerName'); 
    this.loadTickerNotes();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad TickerRecordsPage');
  // }

  saveTickerNote(){
    if(!!this.tickerSavedNotes){
      this.tickerNotes.set(this.tickerName,this.tickerSavedNotes);  
      this.navCtrl.pop();  
    }
    
  }

  loadTickerNotes(){
      this.tickerNotes.get(this.tickerName).then((val) => {
         if(!!val && val.length){
            this.tickerSavedNotes = val;
         }
     });
  }

}
