import { Injectable }              from '@angular/core';
import { Http, Response }          from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { StockLists } from './StockLists';

@Injectable()

export class FinanceService {
  sUrl:any;
  constructor (private http: Http) {
  	this.sUrl = "https://finance.google.com/finance/info?client=ig&q=";
  }

  getStocks (ticker): Observable<StockLists[]> {
    return this.http.get(this.sUrl+ticker)
                    .map(this.extractData)
                    .catch(this.handleError);
  }
  private extractData(res) {
    let body = JSON.parse(JSON.parse(String(JSON.stringify(res._body)).replace("// [", "[")));
    if(body.length === 1){
      return body;
    }else{
      return "error receiving data";
    }
  }

  

  private handleError (error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return Observable.throw(errMsg);
  }
}