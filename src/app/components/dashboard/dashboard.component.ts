import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { FaultMatrix } from '../../shared/data-types/faultMatrix.model';
import { Individual } from '../../shared/data-types/individual.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	
  faultMatrix: FaultMatrix;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
  }

  getFaultMatrix(){
 	 this.dashboardService.getFaultMatrix().subscribe(
     data => this.faultMatrix = data);
     console.log(this.faultMatrix.numberOfTests);
  }

}
