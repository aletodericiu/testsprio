import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { FaultMatrix } from '../../shared/data-types/faultMatrix.model';
import { Individual } from '../../shared/data-types/individual.model';

@Injectable()
export class DashboardService {


    constructor(private httpClient: Http) {
    }

    getFaultMatrix(): Observable<FaultMatrix> {
        const apiURL = 'http://localhost:8080/getfaultmatrix';
        console.log('hei');
        return this.httpClient.get(apiURL, {headers: new Headers()})
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

    getGraphCoordinatesForIndividual(individual: Individual): Observable<number[]> {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');


        const endpoint = 'http://localhost:8080/getgraphcoordinates';
        const body = JSON.stringify( individual );
        return this.httpClient
            .post(endpoint, body, {headers: headers})
            .map(data => data.json());
    }

    getAPFDForInputVector(dataVector: any[]): Observable<number> {
        const headers = new Headers();
        const endpoint = 'http://localhost:8080/getAPFD';
        return this.httpClient
            .post(endpoint, dataVector, {headers: headers})
            .map(data => data.json());
    }
}
