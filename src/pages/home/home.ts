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
  showFilter:boolean;


  constructor(public navCtrl: NavController, private financeService: FinanceService, private tickerStorage: Storage) {
  	  	/* ToDo: get the list from database */
        this.loadStocks();      
  }

  shortByCustomValue(arg){
      this.myStockList.sort( function(name1, name2) {
        let regex = new RegExp(",", "g");
        let firstNumber = parseInt(name1[arg].replace(regex,""));
        let secondNumber = parseInt(name2[arg].replace(regex,""));
        if ( firstNumber < secondNumber ){
          return -1;
        }else if( firstNumber > secondNumber ){
            return 1;
        }else{
          return 0;  
        }
      });
      this.hideFlyoutsMenu(); 
  }

  hideFlyoutsMenu(){
    this.showFilter = false; 
    this.showField = false;
  }

  toggleSearchVisibility(){
    this.showField = !this.showField;
    this.showFilter = false; 
  }

  toggleFilters(){
    this.showFilter = !this.showFilter;
    this.showField = false;
  }

  openGoogleChart(name){
    let baseGoogleUrl = "https://www.google.com/finance?q=NSE:"; 
    window.open(baseGoogleUrl+name, '_blank');
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
