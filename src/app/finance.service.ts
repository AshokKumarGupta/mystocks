import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class FinanceService {
  sUrl:any;
  constructor (private http: Http) {

  }

  getStocks(ticker) {
  	this.sUrl = "http://finance.google.com/finance/info?client=ig&q=";
    return this.http.get(this.sUrl+ticker)
    .map((res) => res.json());
  }

}