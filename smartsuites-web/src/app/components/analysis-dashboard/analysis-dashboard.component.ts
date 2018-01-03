import { Component, OnInit } from '@angular/core';
import {SelectItem} from "primeng/primeng";
import {Car} from "../../demo/domain/car";
import {CarService} from "../../demo/service/carservice";
import {EventService} from "../../demo/service/eventservice";

@Component({
  selector: 'app-analysis-dashboard',
  templateUrl: './analysis-dashboard.component.html',
  styleUrls: ['./analysis-dashboard.component.css']
})
export class AnalysisDashboardComponent implements OnInit {

  cities: SelectItem[];

  cars: Car[];
  cars2: Car[];

  noteType: any;
  taskStat:any;
  userType:any;

  chartData: any;

  events: any[];

  selectedCity: any;

  constructor(private carService: CarService, private eventService: EventService) { }

  ngOnInit() {
    this.carService.getCarsSmall().then(cars => this.cars = cars);
    this.carService.getCarsMedium().then(cars => this.cars2 = cars);
    this.eventService.getEvents().then(events => {this.events = events; });

    this.cities = [];
    this.cities.push({label: 'Select City', value: null});
    this.cities.push({label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}});
    this.cities.push({label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}});
    this.cities.push({label: 'London', value: {id: 3, name: 'London', code: 'LDN'}});
    this.cities.push({label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}});
    this.cities.push({label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}});

    this.chartData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#FFC107'
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          borderColor: '#03A9F4'
        }
      ]
    };


    this.userType ={
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series : [
        {
          name: '访问来源',
          type: 'pie',
          radius : '55%',
          center: ['50%', '50%'],
          data:[
            {value:5, name:'管理人员'},
            {value:23, name:'分析人员'},
            {value:84, name:'业务人员'}
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };


    this.taskStat = {
      tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
          type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      legend: {
        data: ['运行中的任务', '失败的任务','成功的任务']
      },
      grid: {
        left: '0%',
        right: '2%',
        bottom: '2%',
        top:'8%',
        containLabel: true
      },
      xAxis:  {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: ['Spark','Hadoop','Flink','Kylin','Oracle']
      },
      series: [
        {
          name: '运行中的任务',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [320, 302, 301, 334, 390]
        },
        {
          name: '失败的任务',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [120, 132, 101, 134, 90]
        },
        {
          name: '成功的任务',
          type: 'bar',
          stack: '总量',
          label: {
            normal: {
              show: true,
              position: 'insideRight'
            }
          },
          data: [220, 182, 191, 234, 290]
        }
      ]
    };

    this.noteType = {
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      series: [
        {
          name:'访问来源',
          type:'pie',
          selectedMode: 'single',
          radius: [0, '30%'],

          label: {
            normal: {
              position: 'inner'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data:[
            {value:335, name:'Python语言', selected:true},
            {value:679, name:'Scala语言'},
            {value:1548, name:'SQL语言'}
          ]
        },
        {
          name:'解析类型',
          type:'pie',
          radius: ['40%', '55%'],
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            }
          },
          data:[
            {value:335, name:'Tensor Flow'},
            {value:310, name:'Spark Core'},
            {value:234, name:'Spark Streaming'},
            {value:135, name:'Spark MLlib'},
            {value:1048, name:'Oracle SQL'},
            {value:251, name:'Kylin SQL'},
            {value:147, name:'Spark SQL'},
            {value:102, name:'MySQL SQL'}
          ]
        }
      ]
    };
  }

}
