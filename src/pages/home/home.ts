import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  stocks: any[];
  newstock:string; 
  showField:boolean;
  myRestStocks = {};

  constructor(public navCtrl: NavController, public financeService: FinanceService) {
  	  	this.stocks = [{name: "HDFC",	price: 500.2, upordown:"up"}, {name: "ICICI",	price: 1410.2, upordown:"up"},{name: "SBI",	price: 800.2, upordown:"up"}]
  }

  toggleSearchVisibility(sname){
    this.showField = !this.showField;
  }

  addNewStock(sname){
	this.stocks.push({name:sname,price:1,upordown:"up"})
	console.log(this.FinanceService.getStocks('HDFC').subscribe(data => this.myRestStocks = data));
  }

  removeStock(index){
	this.stocks.splice(index,1);
  }
  

}
