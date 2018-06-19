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
    showAPFDForInputVector: boolean;
    public chart = [];
    fileUploaded: boolean;
    apfdInputVector: number;
    dataVector: number[] = [];
    arr: any[];
    arri: string[]= [];
    showFullMatrixContentTab: boolean;
    showBestIndividualContentTab: boolean;
    showBestThreeIndividualsContentTab: boolean;
    showAPFDForInputVectorContentTab: boolean;
    test;
    testMatrix;
    selectedMetric;

    constructor(private dashboardService: DashboardService) { }

    ngOnInit() {

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
            });
        this.showFullMatrixContentTab = true;
        this.showBestIndividualContentTab = false;
        this.showBestThreeIndividualsContentTab = false;
        this.showAPFDForInputVectorContentTab = false;
        this.resetCalculateAPFDForInputView();
    }

    getBestIndividual() {
        this.dashboardService.getBestIndividual().subscribe(
            data => {
                this.bestIndividual = data;
                console.log(this.bestIndividual);
                this.createGraphForIndividual(this.bestIndividual, 0);
                for (let _i = 0; _i < this.bestIndividual.genes.length; _i++) {
                    this.bestIndividual.genes[_i]++;
                }
            });
        this.showFullMatrixContentTab = false;
        this.showBestIndividualContentTab = true;
        this.showBestThreeIndividualsContentTab = false;
        this.showAPFDForInputVectorContentTab = false;
        this.apfdInputVector = null;
        this.resetCalculateAPFDForInputView();
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
        this.apfdInputVector = null;
        this.resetCalculateAPFDForInputView();

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
        // for (let _i = 0; _i < individual.genes.length; _i++) {
        //     individual.genes[_i]++;
        // }
        individual.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: individual.genes,
                datasets: [
                    {
                        label: 'Some Data',
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

    setFileUploaded(ev) {
        // ev = true; // test only
        this.fileUploaded = ev;
        console.log(ev);
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
                this.apfdInputVector = data;
                console.log(this.apfdInputVector);
            });
    }

    initAPFDForInputVectorTab() {
        this.showAPFDForInputVectorContentTab = true;
        this.showBestIndividualContentTab = false;
        this.showBestThreeIndividualsContentTab = false;
        this.showFullMatrixContentTab = false;
    }

    calculateAPFD() {
        // console.log(this.arri);
        const myArr = [];
        this.arri.forEach((item: any) => myArr.push(parseInt(item, 10) - 1));
        console.log(this.arri);
        console.log('myArr', myArr);
        this.dashboardService.getAPFDForInputVector(myArr).subscribe(
            data => {
                this.apfdInputVector = data;
                const indv = new Individual(myArr.length, myArr, this.apfdInputVector);
                this.createGraphForIndividual(indv, 6);
                // for (let _i = 0; _i < myArr.length; _i++) {
                //     myArr[_i]++;
                // }
                console.log(this.apfdInputVector);
            });
    }

    resetCalculateAPFDForInputView() {
        this.apfdInputVector = null;
        for (let _i = 0; _i < this.arri.length; _i++) {
            this.arri[_i] = null;
        }
    }

    checkIfElementRepeatsInVector(elem: any): boolean {
        let count = 0;
        for (let _i = 0; _i < this.arri.length; _i++) {
            if (elem === this.arri[_i]) {
                count++;
            }
        }
        const errMsg1 = document.getElementById('errMsg1');
        errMsg1.className = (count > 1) ? 'msg error' : 'msg';
        return count > 1;
    }

    checkIfElementExceedsRange(elem: any): boolean {
        if (elem <= 0 || elem > this.faultMatrix.numberOfTests) {
            return true;
        }
            return false;
    }

    onChange1(event, value) {
        console.log(event);
        console.log(value);
        this.selectedMetric = value;
    }

}
