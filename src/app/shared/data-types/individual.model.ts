import { Chart } from 'chart.js';
export class Individual{
	nrTests: number;
	genes: number[];
	fitness: number;
	graphCoords: number[];
	chart: Chart;
	constructor(nrTests: number, genes: number[], fitness: number){
		this.nrTests = nrTests;
		this.genes = genes;
		this.fitness = fitness;
	}
}