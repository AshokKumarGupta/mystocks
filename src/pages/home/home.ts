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
  showField:boolean;
  myStockList: any[];
  tickerNames:  any[];
  newstock: string;
  sIndex:number;

  

  constructor(public navCtrl: NavController, private financeService: FinanceService, private tickerStorage: Storage) {
  	  	/* ToDo: get the list from database */
        this.loadStocks();      
  }

  toggleSearchVisibility(){
    this.showField = !this.showField;
  }

  toggleFilters(){
    this.showFilter = !this.showFilter;
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
           this.newstock = ""; 
           this.showField = false;
           this.tickerStorage.set('shares',this.tickerNames);

     });

  }

  resetStock(){
      //if(!!this.myStockList) {
        this.myStockList = undefined;
      //}
  }

  loadStocks(){
    this.sIndex = 0;
      this.tickerStorage.get('shares').then((val) => {
         if(!!val[0] && val.length){
            this.myTickerLoop(val, val.length);
         }
     })
  }

  reloadStocks(){
      this.resetStock();
      this.loadStocks();
  }

  removeStock(index){
    	this.myStockList.splice(index,1);
      this.tickerNames.splice(index,1);
      this.tickerStorage.set('shares',this.tickerNames);
  }
  

}
