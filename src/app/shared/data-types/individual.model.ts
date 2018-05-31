export class Individual{
	nrTests: number;
	genes: number[];
	fitness: number;
	constructor(nrTests: number, genes: number[], fitness: number){
		this.nrTests = nrTests;
		this.genes = genes;
		this.fitness = fitness;
	}
}