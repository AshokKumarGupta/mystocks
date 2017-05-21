import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FinanceService } from '../../app/finance.service';
import { Storage } from '@ionic/storage';
import { TickerRecordsPage } from '../../pages/ticker-records/ticker-records';




@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FinanceService,Storage]
})

export class HomePage { 
  showField:boolean;
  showSearch:boolean;
  myStockList: any[];
  tickerNames:  any[];
  newstock: string;
  sIndex:number;
  showFilter:boolean;
  actualStockList:any[];
  scriptName:any;
  clearStcokInterval:number; 
  isAllStocksLoaded:boolean;
  totalStocksList:string;
  currentShortValue:string; 
  tickerContents:any[];
  tickerRecords = TickerRecordsPage;
  
  constructor(public navCtrl: NavController, private financeService: FinanceService, private tickerStorage: Storage) {
        this.scriptName = "";
  	  	/* ToDo: get the list from database */
        this.loadStocks();     
  }

  fullSorting(value){
      // if(!!this.currentShortValue){
        switch (value){
          case "shortByCustomValue":
              this.shortByCustomValue('l');
          break;
          case "shortByCustomLoserValue": 
              this.shortByCustomLoserValue('cp_fix');
          break;
          case "shortByCustomGainerValue":
              this.shortByCustomGainerValue('cp_fix');
          break;
          case "shortByScriptName":
              this.shortByScriptName('t');
          break;
          default:
              this.myStockList = this.actualStockList;
          break; 
        }
    // }
  }

  shortByCustomValue(arg){
      this.myStockList = this.actualStockList.sort( function(name1, name2) {
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
      this.currentShortValue = "shortByCustomValue";
  }

  shortByCustomLoserValue(arg){
      this.myStockList = this.actualStockList.sort( function(name1, name2) {
        let firstNumber = Number(name1[arg]);
        let secondNumber = Number(name2[arg]);
        if ( firstNumber < secondNumber ){
          return -1;
        }else if( firstNumber > secondNumber ){
            return 1;
        }else{
          return 0;  
        }
      });
      this.currentShortValue = "shortByCustomLoserValue";
  }

  shortByCustomGainerValue(arg){
      this.myStockList = this.actualStockList.sort( function(name1, name2) {
        let firstNumber = Number(name1[arg]);
        let secondNumber = Number(name2[arg]);
        if ( firstNumber < secondNumber ){
          return 1;
        }else if( firstNumber > secondNumber ){
            return -1;
        }else{
          return 0;  
        }
      });
      this.currentShortValue = "shortByCustomGainerValue";
  }

  shortByScriptName(arg){
      this.myStockList = this.actualStockList.sort( function(name1, name2) {
        return name1[arg].localeCompare(name2[arg]);
      });
      this.currentShortValue = "shortByScriptName";
  }

  searchForThisScript(script){
    if(script.length > 2){
       this.myStockList = this.myStockList.filter(function(value) {
            if(value.t.localeCompare(script.toUpperCase()) == 0){
              return 1;
            }
       });
       this.hideFlyoutsMenu(); 
       this.stopLiveReload();
       this.scriptName = null;
    }
  }

  startLiveReload(){  
      // true
      this.isAllStocksLoaded = (this.totalStocksList  == String(this.tickerNames))? true:false;
      this.refreshStockInterval();
  }

  storeTextForTicker(tickerName){
      this.navCtrl.push(this.tickerRecords,{'tickerName':tickerName}); 
  }

  stopLiveReload(){
      clearInterval(this.clearStcokInterval);
      this.isAllStocksLoaded = false;
  }

  refreshAllStocks(list){
    this.isAllStocksLoaded = (this.totalStocksList  == String(this.tickerNames))? true:false;
    if(this.isAllStocksLoaded && this.tickerNames.length>0){
      this.financeService.getStocks(list).subscribe(data => {
          this.actualStockList = data;
      });
    }
    this.totalStocksList  = list; 
    this.fullSorting(this.currentShortValue); 
  }

  refreshStockInterval(){
    this.clearStcokInterval = setInterval(() => {
      this.refreshAllStocks(this.tickerNames);
    }, 10000);
  }

  hideFlyoutsMenu(){
    this.showFilter = false; 
    this.showSearch = false;  
    this.showField = false;
  }

  toggleSearch(){
    this.showFilter = false; 
    this.showField = false;
    this.showSearch = !this.showSearch;
    this.myStockList = this.actualStockList;
  }

  toggleSearchVisibility(){
    this.showFilter = false; 
    this.showSearch = false;
    this.showField = !this.showField;
  }

  toggleFilters(){
    this.showSearch = false;  
    this.showField = false;
    this.showFilter = !this.showFilter;
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
	    this.financeService.getStocks(sname).subscribe(data => {
           if(!this.myStockList){
             this.myStockList = data
             this.tickerNames = [data[0]["t"]]; 
           }else{
             this.myStockList.push(data[0]);
             this.tickerNames.push(data[0]["t"]);
           }
           this.actualStockList = this.myStockList;
           this.newstock = ""; 
           this.hideFlyoutsMenu();
           this.tickerStorage.set('shares',this.tickerNames);
           // this.refreshStockInterval();
     });

  }

  resetStock(){
     this.myStockList = undefined;
  }

  loadStocks(){
    this.sIndex = 0;
      this.tickerStorage.get('shares').then((val) => {
         if(!!val[0] && val.length){
            this.myTickerLoop(val, val.length);
         }
     });
     this.refreshStockInterval();
  }

  reloadStocks(){
      clearInterval(this.clearStcokInterval);
      this.resetStock();
      this.loadStocks();
  }

  removeStock(index){
    	this.myStockList.splice(index,1);
      this.actualStockList = this.myStockList;
      this.tickerNames.splice(index,1);
      this.tickerStorage.set('shares',this.tickerNames); 
  }
  
}
