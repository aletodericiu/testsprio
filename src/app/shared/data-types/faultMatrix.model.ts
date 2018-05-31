export class FaultMatrix{
	numberOfFaults: number;
	numberOfTests: number;
	data: number[][];
	constructor(numberOfFaults: number, numberOfTests: number, data: number[][]){
		this.numberOfFaults = numberOfFaults;
		this.numberOfTests = numberOfTests;
		this.data = data;
	}
}