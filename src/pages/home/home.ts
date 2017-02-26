import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FinanceService } from '../../app/finance.service';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [FinanceService]
})
export class HomePage {
  stocks: any[];
  newstock:string; 
  showField:boolean;
  myStockList: any[];
  httpresponse:{};
  errorMessage: string;
  

  constructor(public navCtrl: NavController, private financeService: FinanceService) {
  	  	/* ToDo: get the list from database */
  }

  toggleSearchVisibility(sname){
    this.showField = !this.showField;
  }



  addNewStock(sname){
	// this.stocks.push({name:sname,price:1,upordown:"up"})
	this.financeService.getStocks(sname).subscribe(data => this.myStockList.push(this.convertToJSObject(data)),
                       error =>  this.errorMessage = <any>error);

  }

  convertToJSObject(str){
  		return JSON.parse(String(JSON.stringify(str)).replace("// [", "["));
  }

  removeStock(index){
	this.stocks.splice(index,1);
  }
  

}
