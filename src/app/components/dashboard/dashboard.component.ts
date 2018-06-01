import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { FaultMatrix } from '../../shared/data-types/faultMatrix.model';
import { Individual } from '../../shared/data-types/individual.model';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    faultMatrix: FaultMatrix = new FaultMatrix(null, null, null);
    bestIndividual: Individual = new Individual(null, null, null);
    bestThreeIndividuals: Individual[];
    graphCoord: number[];
    showFaultMatrix: boolean;
    showBestIndividual: boolean;
    showBestThreeIndividuals: boolean;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.showFaultMatrix = false;
        this.showBestIndividual = false;
        this.showBestThreeIndividuals = false;
    }

    getFaultMatrix() {
        this.dashboardService.getFaultMatrix().subscribe(
            data => {this.faultMatrix = data; console.log(this.faultMatrix);   this.showFaultMatrix = true;
            });
    }

    getBestIndividual() {
        this.dashboardService.getBestIndividual().subscribe(
            data => {this.bestIndividual = data;
            console.log(this.bestIndividual);
            this.showBestIndividual = true;
            for (let _i = 0; _i < this.bestIndividual.genes.length; _i++) {
                    this.bestIndividual.genes[_i]++;
            }
            this.graphCoord = this.getGraphCoordinates(this.bestIndividual);
            });
    }

    getBestThreeIndividuals() {
        this.dashboardService.getBestThreeIndividuals().subscribe(
            data => {this.bestThreeIndividuals = data;
            console.log(this.bestThreeIndividuals);
            this.showBestThreeIndividuals = true;
            for (let _j = 0; _j < this.bestThreeIndividuals.length; _j++) {
                    for (let _i = 0; _i < this.bestThreeIndividuals[_j].genes.length; _i++) {
                        this.bestThreeIndividuals[_j].genes[_i]++;
                    }
                }
            });
    }

    getGraphCoordinates(individual: Individual): number[] {
        let result: number[];
        this.dashboardService.getGraphCoordinatesForIndividual(individual).subscribe(
             data => {console.log(data); result = data; });
        return result;
    }

}
