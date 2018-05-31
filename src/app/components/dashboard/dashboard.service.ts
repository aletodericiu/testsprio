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
        const apiURL = 'http://localhost:8080/getfaultmatrix';
        console.log('hei');
        return this.httpClient.get(apiURL)
            .map(data => data.json());
    }

    getBestIndividual(): Observable<Individual> {
        const apiURL = 'http://localhost:8080/getbestindividual';
        return this.httpClient.get(apiURL)
            .map(data => data.json());
    }

    getBestThreeIndividuals(): Observable<Individual[]> {
        const apiURL = 'http://localhost:8080/getbestthreeindividuals';
        return this.httpClient.get(apiURL)
            .map(data => data.json());
    }
}
