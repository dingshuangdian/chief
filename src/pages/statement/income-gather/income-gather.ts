import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

import ECharts from 'echarts';
import { WebSites } from '../../../providers/web-sites';
import { DatePipe } from '@angular/common';

/**
 * Generated class for the IncomeGatherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-income-gather',
  templateUrl: 'income-gather.html',
})
export class IncomeGatherPage {

  @ViewChild('main1') mychart1: ElementRef;

  segmentType: string = 'daily';

  beginDate: string;
  endDate: string;

  month: string;

  year: string;

  dailyInfo: any = {};

  monthlyInfo = [];

  annualInfo = [];

  chartInfo: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, public websites: WebSites, private datePipe: DatePipe, public events: Events) {

  }


  ionViewWillEnter() {
    this.beginDate = this.endDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.month = this.datePipe.transform(new Date(), "yyyy-MM");
    this.year = this.datePipe.transform(new Date(), "yyyy");
    this.events.subscribe('stateTabs:IncomeGatherPage', () => {
      this.segmentChanged();
    })
  }

  segmentChanged() {
    if (this.segmentType == "daily") {
      this.dateChange();
    } else if (this.segmentType == "monthly") {
      this.monthChange();
    } else if (this.segmentType == "annual") {
      this.yeasChange();
    }
  }

  dateChange() {
    let parm = { beginDate: this.beginDate, endDate: this.endDate };
    this.websites.httpPost('finddaysReport', parm, false).subscribe(res => {
      if (res) {
        this.dailyInfo = res;
      } else {
        this.dailyInfo = {};
      }
    })
  }

  monthChange() {
    let parm = { month: this.month };
    this.websites.httpPost('findmonthReport', parm, false).subscribe(res => {
      if (res) {
        this.monthlyInfo = res;
      } else {
        this.monthlyInfo = [];
      }
    })
  }

  yeasChange() {
    let parm = { year: this.year };
    this.websites.httpPost('findyearReport', parm, false).subscribe(res => {
      if (res) {
        this.annualInfo = res;
        let xd = [], id = [], cd = [], pd = [];
        this.annualInfo.forEach(c => {
          xd.push(c.month);
          id.push(c.incomeAmount);
          cd.push(c.costAmount);
          pd.push(c.profitAmount);
        });
        this.chartInfo.xd = xd;
        this.chartInfo.id = id;
        this.chartInfo.cd = cd;
        this.chartInfo.pd = pd;
      } else {
        this.annualInfo = [];
        this.chartInfo = {};
      }
      this.depictC();
    })
  }

  depictC() {
    if (this.mychart1) {
      let myChart = ECharts.init(this.mychart1.nativeElement);

      let option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '20%',
          right: '10%',
          top: '15%'
        },
        legend: {
          data: ['收入', '支出', '盈亏']
        },
        color: ['#f53d3d', '#3AE7C8', '#DA71D6'],
        xAxis: {
          type: 'category',
          data: this.chartInfo.xd
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '￥{value}',
          }
        },
        series: [{
          name: '收入',
          data: this.chartInfo.id,
          type: 'line',
          smooth: true
        },
        {
          name: '支出',
          data: this.chartInfo.cd,
          type: 'line',
          smooth: true
        },
        {
          name: '盈亏',
          data: this.chartInfo.pd,
          type: 'line',
          smooth: true
        }]
      };
      myChart.setOption(option);
    }
  }

}
