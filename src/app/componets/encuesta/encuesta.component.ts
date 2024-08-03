import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart,ChartData, ChartConfiguration, ChartEvent, ChartType, CategoryScale } from 'chart.js/auto';
import { WebsocketService } from '../../services/websocket.service';
import { BaseChartDirective } from 'ng2-charts';

//https://stackoverflow.com/questions/67727603/error-category-is-not-a-registered-scale
//import {CategoryScale} from 'chart.js/auto'; 
Chart.register(CategoryScale);
//import {default as Annotation} from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    
      // datalabels: {
      //   anchor: 'end',
      //   align: 'end',
      // },
    },
  };
  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4'],
    datasets: [
      { data: [65, 59, 80, 81], label: 'Entrevistados' },

    ],
  };


  constructor(
    private http: HttpClient,
    private wsService: WebsocketService,

  ){}
  
  ngOnInit(): void {
    this.http.get('http://localhost:5000/grafica-encuesta').subscribe(
      (data: any) => {
        console.log('datos recibidos', data);
  
        this.barChartData.datasets[0].data = data[0].data;
        this.barChartData.datasets[0].label = data[0].label;
        
        this.chart?.update();


      }
    );
    this.escucharSockets() ;
  }

 
  escucharSockets() {
    this.wsService.listen('cambio-grafica-encuesta')
      .subscribe((data: any) => {
        console.log('socket', data);
        this.barChartData.datasets[0].data = data[0].data;
        this.barChartData.datasets[0].label = data[0].label;
              
        this.chart?.update();
    });
  }
}
