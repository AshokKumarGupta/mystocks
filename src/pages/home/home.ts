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
  myStockList: myStockList;
  httpresponse:{};
  errorMessage: string;
  

  constructor(public navCtrl: NavController, private financeService: FinanceService) {
  	  	this.stocks = [{
	  	  		name: "HDFC",	
	  	  		price: 500.2, 
	  	  		upordown:"up"
  	  		}, 
  	  		{
	  	  		name: "ICICI",	
	  	  		price: 1410.2, 
	  	  		upordown:"up"
  	  		},
  	  		{
	  	  		name: "SBI",	
	  	  		price: 800.2, 
	  	  		upordown:"up"
  	  		}]
  }

  toggleSearchVisibility(sname){
    this.showField = !this.showField;
  }



  addNewStock(sname){
	// this.stocks.push({name:sname,price:1,upordown:"up"})
	this.financeService.getStocks(sname).subscribe(data => this.myStockList = JSON.stringify(data); console.log(this.myStockList),
                       error =>  this.errorMessage = <any>error);

  }

  removeStock(index){
	this.stocks.splice(index,1);
  }
  

}

interface myStockList {
	c:string
	"c_fix":string
	ccol:string
	cp:string
	"cp_fix":string
	e:string
	id:string
	l:string
	"l_cur":string
	"l_fix":string
	lt:string
	"lt_dts":string
	ltt:string
	"pcls_fix":string
	s:string
	t:string
}

