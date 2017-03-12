import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FinanceService } from '../../app/finance.service';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FinanceService,Storage]
})
export class HomePage {
  stocks: any[];
  newstock:string; 
  showField:boolean;
  myStockList: any[];
  httpresponse:{};
  errorMessage: string;
  tickerNames:  any[];
  sIndex:number;

  

  constructor(public navCtrl: NavController, private financeService: FinanceService, private tickerStorage: Storage) {
  	  	/* ToDo: get the list from database */
        this.sIndex = 0;
        this.tickerStorage.get('shares').then((val) => {
           if(!!val[0] && val.length){
              this.myTickerLoop(val, val.length);
           }
       })
         
  }

  toggleSearchVisibility(sname){
    this.showField = !this.showField;
  }

  myTickerLoop(val, iLength){
    var __this = this;
    setTimeout(function () { 
        if (__this.sIndex < iLength) {
          __this.addNewStock(val[__this.sIndex]);
          __this.myTickerLoop(val,iLength)
        }
        __this.sIndex++;
    }, 1000);
  }
 


  addNewStock(sname){
	// this.stocks.push({name:sname,price:1,upordown:"up"})

	this.financeService.getStocks(sname).subscribe(data => {
                         if(!this.myStockList){
                           this.myStockList = data
                           this.tickerNames = [data[0]["t"]];
                         }else{
                           this.myStockList.push(data[0]);
                           this.tickerNames.push(data[0]["t"]);
                         }
                         
                         this.tickerStorage.set('shares',this.tickerNames);
                       });

  }

  removeStock(index){
    	this.myStockList.splice(index,1);
  }
  

}
