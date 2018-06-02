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
    showFaultMatrix: boolean;
    showBestIndividual: boolean;
    showBestThreeIndividuals: boolean;
    showAPFDForInputVector: boolean;
    public chart = [];
    showChart: boolean;
    fileUploaded: boolean;
    appfInputVector: number;
    dataVector: number[] = [];

    showFullMatrixContentTab: boolean;
    showBestIndividualContentTab: boolean;
    showBestThreeIndividualsContentTab: boolean;
    showAPFDForInputVectorContentTab: boolean;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.showFaultMatrix = false;
        this.showBestIndividual = false;
        this.showBestThreeIndividuals = false;
        this.showAPFDForInputVector = false;
    }

    getFaultMatrix() {
        this.dashboardService.getFaultMatrix().subscribe(
            data => {
                this.faultMatrix = data;
                console.log(this.faultMatrix);
                this.showFaultMatrix = true;
            });
        this.showFullMatrixContentTab = true;
        this.showBestIndividualContentTab = false;
        this.showBestThreeIndividualsContentTab = false;
    }

    getBestIndividual() {
        this.dashboardService.getBestIndividual().subscribe(
            data => {
                this.bestIndividual = data;
                console.log(this.bestIndividual);
                this.showBestIndividual = true;
                this.createGraphForIndividual(this.bestIndividual);
                for (let _i = 0; _i < this.bestIndividual.genes.length; _i++) {
                    this.bestIndividual.genes[_i]++;
                }
            });
        this.showFullMatrixContentTab = false;
        this.showBestIndividualContentTab = true;
        this.showBestThreeIndividualsContentTab = false;
    }

    getBestThreeIndividuals() {
        this.dashboardService.getBestThreeIndividuals().subscribe(
            data => {this.bestThreeIndividuals = data;
            console.log(this.bestThreeIndividuals);
            this.showBestThreeIndividuals = true;
            for (let _j = 0; _j < this.bestThreeIndividuals.length; _j++) {
                this.createGraphForIndividual(this.bestThreeIndividuals[_j]);
                    for (let _i = 0; _i < this.bestThreeIndividuals[_j].genes.length; _i++) {
                        this.bestThreeIndividuals[_j].genes[_i]++;
                    }
                }
                console.log(this.bestThreeIndividuals);
            });
        this.showFullMatrixContentTab = false;
        this.showBestIndividualContentTab = false;
        this.showBestThreeIndividualsContentTab = true;
    }

    createGraphForIndividual(individual: Individual) {
        this.dashboardService.getGraphCoordinatesForIndividual(individual).subscribe(
            data2 => {
                individual.graphCoords =  data2;
                this.trasnformGraphCoords(individual.graphCoords);
                this.createGraphVisualForIndividual(individual.chart, individual);
            });
    }

    trasnformGraphCoords(coords: number[]) {
        for (let _j = 1; _j < coords.length; _j++) {
            coords[_j] += coords[_j - 1];
        }
        coords.reverse().push(0);
        coords.reverse();
    }

    createGraphVisualForIndividual(chart: Chart, individual: Individual) {
        const canvas = <HTMLCanvasElement> document.getElementById('canvas2');
        const ctx = canvas.getContext('2d');
        const a = ['a', 'b', 'c', 'd', 'e', 'f'];
        const b = [0, 7, 10, 10, 10, 10];
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                //labels: ['a', 'b', 'c', 'd', 'e'],
                labels: individual.genes,
                datasets: [
                    {
                        label: 'Some Data',
                        // data: [0, 7, 10, 10, 10],
                        data: individual.graphCoords,
                        borderColor: 'black',
                        borderWidth: 2,
                        fill: false,
                        cubicInterpolationMode: 'monotone'
                    }
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

    onButtonGroupClick($event) {
        const clickedElement = $event.target || $event.srcElement;

        if (clickedElement.nodeName === 'BUTTON') {
            const isCertainButtonAlreadyActive = clickedElement.parentElement.querySelector('.active');
            if ( isCertainButtonAlreadyActive ) {
                isCertainButtonAlreadyActive.classList.remove('active');
            }
            clickedElement.className += ' active';
        }
    }

    setFileUploaded(ev) {
        // this.fileUploaded = ev;
        this.fileUploaded = true; // for testing purpose
    }

    getAPFDForInputVecotr() {
        const endpoint = 'http://localhost:8080/getAPFD';
        this.dashboardService.getAPFDForInputVector(this.dataVector).subscribe(
            data => {
                this.appfInputVector = data;
                console.log(this.appfInputVector);
            });
    }

    initAPFDForInputVectorTab() {
        this.showAPFDForInputVectorContentTab = true;
        this.showBestIndividualContentTab = false;
        this.showBestThreeIndividualsContentTab = false;
        this.showFullMatrixContentTab = false;
        // this.getBestIndividual();
        // this.dataVector.length = this.bestIndividual.nrTests;
    }

    // {"nrTests":5,"genes":[2,4,1,0,3],"fitness":0.84} cu asta fac call la aia cu graph si primesc [7,3,0,0,0]


}
