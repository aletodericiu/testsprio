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
    arr: any[];
    arri: any[]= [];

    showFullMatrixContentTab: boolean;
    showBestIndividualContentTab: boolean;
    showBestThreeIndividualsContentTab: boolean;
    showAPFDForInputVectorContentTab: boolean;
    test;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {
        this.showFaultMatrix = false;
        this.showBestIndividual = false;
        this.showBestThreeIndividuals = false;
        this.showAPFDForInputVector = false;
    }

    fillArrayWithNumbers(n) {
        this.arr = Array.apply(null, Array(n));
        return this.arr.map(function (x, i) { return i });
    }

    getFaultMatrix() {
        this.dashboardService.getFaultMatrix().subscribe(
            data => {
                this.faultMatrix = data;
                this.fillArrayWithNumbers(this.faultMatrix.numberOfTests);
                console.log(this.faultMatrix);
                this.showFaultMatrix = true;
            });
        this.showFullMatrixContentTab = true;
        this.showBestIndividualContentTab = false;
        this.showBestThreeIndividualsContentTab = false;
        this.showAPFDForInputVectorContentTab = false;
    }

    getBestIndividual() {
        this.dashboardService.getBestIndividual().subscribe(
            data => {
                this.bestIndividual = data;
                console.log(this.bestIndividual);
                this.showBestIndividual = true;
                this.createGraphForIndividual(this.bestIndividual, 0);
                for (let _i = 0; _i < this.bestIndividual.genes.length; _i++) {
                    this.bestIndividual.genes[_i]++;
                }
            });
        this.showFullMatrixContentTab = false;
        this.showBestIndividualContentTab = true;
        this.showBestThreeIndividualsContentTab = false;
        this.showAPFDForInputVectorContentTab = false;
    }

    getBestThreeIndividuals() {
        this.dashboardService.getBestThreeIndividuals().subscribe(
            data => {
                this.bestThreeIndividuals = data;
                // this.createGraphsForTop3(this.bestThreeIndividuals);
                for (let _j = 0; _j < this.bestThreeIndividuals.length; _j++) {
                    console.log(this.bestThreeIndividuals[_j]);
                    this.createGraphForIndividual(this.bestThreeIndividuals[_j], _j + 1);
                    for (let _i = 0; _i < this.bestThreeIndividuals[_j].genes.length; _i++) {
                        this.bestThreeIndividuals[_j].genes[_i]++;
                    }
                    // this.createGraphForIndividual(this.bestThreeIndividuals[_j]);
                }
            });

        this.showFullMatrixContentTab = false;
        this.showBestIndividualContentTab = false;
        this.showBestThreeIndividualsContentTab = true;
        this.showAPFDForInputVectorContentTab = false;

    }

    createGraphForIndividual(individual: Individual, index) {
        this.dashboardService.getGraphCoordinatesForIndividual(individual).subscribe(
            data2 => {
                individual.graphCoords =  data2;
                this.trasnformGraphCoords(individual.graphCoords);
                console.log(individual.graphCoords);
                this.createGraphVisualForIndividual(individual, index);
            });
    }

    trasnformGraphCoords(coords: number[]) {
        for (let _j = 1; _j < coords.length; _j++) {
            coords[_j] += coords[_j - 1];
        }
        coords.reverse().push(0);
        coords.reverse();
    }

    createGraphVisualForIndividual(individual: Individual, index) {
        const canvas = <HTMLCanvasElement> document.getElementById(`canvas${index}`);
        const ctx = canvas.getContext('2d');
        const a = ['a', 'b', 'c', 'd', 'e', 'f'];
        const b = [0, 7, 10, 10, 10, 10];
        individual.chart = new Chart(ctx, {
            type: 'line',
            data: {
                // labels: ['a', 'b', 'c', 'd', 'e'],
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
        this.fileUploaded = ev;
        console.log(ev);
        // this.fileUploaded = true; // for testing purpose
        this.showFullMatrixContentTab = ev;
        ev ? this.getFaultMatrix() : this.resetAll();
    }

    resetAll() {
        this.showFullMatrixContentTab = false;
        this.showBestIndividualContentTab = false;
        this.showBestThreeIndividualsContentTab = false;
        this.showAPFDForInputVectorContentTab = false;
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

    calculateAPFD() {
        console.log(this.arri);
    }

    // {"nrTests":5,"genes":[2,4,1,0,3],"fitness":0.84} cu asta fac call la aia cu graph si primesc [7,3,0,0,0]


}
