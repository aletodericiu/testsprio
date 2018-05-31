import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { FaultMatrix } from '../../shared/data-types/faultMatrix.model';
import { Individual } from '../../shared/data-types/individual.model';

@Injectable()
export class DashboardService {

  private headers: Headers;

  constructor(private httpClient: Http) {
      this.headers = new Headers();
  }

  getFaultMatrix(): Observable<FaultMatrix> {
	  let apiURL = 'http://localhost:8080/getfaultmatrix';
	  return this.httpClient.get(apiURL) 
	      .map(data => data.json());
	}

  getBestIndividual(): Observable<Individual> {
	  let apiURL = 'http://localhost:8080/getbestindividual';
	  return this.httpClient.get(apiURL) 
	      .map(res => { 
	        return res.json().results.map(item => { 
	          return new Individual( 
	              item.nrTests,
	              item.genes,
	              item.fitness
	          );
	        });
	      });
	}

	getBestThreeIndividuals(): Observable<Individual[]> {
	  let apiURL = 'http://localhost:8080/getbestthreeindividuals';
	  return this.httpClient.get(apiURL) 
	      .map(res => { 
	        return res.json().results.map(item => { 
	          return new Individual( 
	              item.nrTests,
	              item.genes,
	              item.fitness
	          );
	        });
	      });
	}
}
