import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { FaultMatrix } from '../../shared/data-types/faultMatrix.model';
import { Individual } from '../../shared/data-types/individual.model';
import {forEach} from '@angular/router/src/utils/collection';
import { Chart } from 'chart.js';

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
    public chart = [];

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
            data => {
                this.bestIndividual = data;
                console.log(this.bestIndividual);
                this.showBestIndividual = true;
                this.dashboardService.getGraphCoordinatesForIndividual(this.bestIndividual).subscribe(
                    data2 => {
                        console.log(data2);
                        this.graphCoord =  data2;
                        this.trasnformGraphCoords(this.graphCoord);
                        console.log(this.graphCoord);
                    });
                for (let _i = 0; _i < this.bestIndividual.genes.length; _i++) {
                    this.bestIndividual.genes[_i]++;
                }
                // this.graphCoord = this.getGraphCoordinates(this.bestIndividual)
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

    trasnformGraphCoords(coords: number[]) {
        for (let _j = 1; _j < coords.length; _j++) {
            coords[_j] += coords[_j - 1];
        }
        coords.reverse().push(0);
        coords.reverse();
    }

    createGraphFroBestIndividual(){
        var canvas = <HTMLCanvasElement> document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ["a", "b", "c", "d", "e"],
                datasets: [
                    {
                        title: "Some Data",
                        values: [25, 40, 30, 35, 100],
                        borderColor: "#3cba9f",
                        fill: false
                    },
                ]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        display: true
                    }],
                    yAxes: [{
                        display: true
                    }],
                }
            }
        });
    }

    //{"nrTests":5,"genes":[2,4,1,0,3],"fitness":0.84} cu asta fac call la aia cu graph si primesc [7,3,0,0,0]


}
