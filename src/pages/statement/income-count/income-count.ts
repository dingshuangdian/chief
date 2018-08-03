import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { CommissionCountPage } from '../commission-count/commission-count';
import { DatePipe } from '@angular/common';
import { WebSites } from '../../../providers/web-sites';

import ECharts from 'echarts';
import { CsbzNave } from '../../../providers/csbz-nave';
/**
 * Generated class for the IncomeCountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-income-count',
  templateUrl: 'income-count.html',
})
export class IncomeCountPage {

  @ViewChild('profit') profitChart: ElementRef;
  @ViewChild('cost') costChart: ElementRef;
  @ViewChild('income') incomeChart: ElementRef;
  @ViewChild('cake') cakeChart: ElementRef;

  segmentType: string = '单日';

  incomeInfo: any = {};

  beginDate: string;
  endDate: string;

  profitData = [];
  costData = [];
  incomeData = [];
  cakeData: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams, private datePipe: DatePipe, public websites: WebSites, private csbzNave: CsbzNave, public events: Events) {
    this.events.subscribe('stateTabs:IncomeCountPage', () => {
      this.segmentChanged();
    })
  }

  ionViewDidLoad() {
    this.beginDate = this.endDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
  }

  segmentChanged() {
    if (this.segmentType == "单日") {
      this.dateChange();
    } else if (this.segmentType == "近30日") {
      this.findBalanceReports4Month();
    } else if (this.segmentType == "近半年") {
      this.findBalanceReports4Year();
    }

  }

  dateChange() {
    let parm = { beginDate: this.beginDate, endDate: this.endDate };
    this.websites.httpPost('findDayBalanceReport', parm).subscribe(res => {
      this.calculate(res);
    })
  }

  findBalanceReports4Month() {
    this.websites.httpPost('findBalanceReports4Month', {}).subscribe(res => {
      this.calculate(res);
    })
  }

  findBalanceReports4Year() {
    this.websites.httpPost('findBalanceReports4Year', {}).subscribe(res => {
      this.calculate(res);
    })
  }


  calculate(res) {

    let profitAmount = 0,
      incomeAmount = 0,
      costAmount = 0,
      incomeArry = [],
      saleCard = 0,
      rechargeCard = 0,
      asorder = 0,
      offsin = 0,
      journalin = 0,
      stocksale = 0,
      costArry = [],
      retreatCard = 0,
      stockin = 0,
      offsout = 0,
      journalout = 0;
    this.profitData = [];
    this.costData = [];
    this.incomeData = [];
    this.cakeData = {};

    if (Object.prototype.toString.call(res) == '[object Array]' && this.segmentType !== '单日') {
      res.forEach(e => {
        saleCard += e.saleCard;
        rechargeCard += e.rechargeCard;
        asorder += e.asorder;
        offsin += e.offsin;
        journalin += e.journalin;
        stocksale += e.stocksale;
        retreatCard += e.retreatCard;
        stockin += e.stockin;
        offsout += e.offsout;
        journalout += e.journalout;

        incomeAmount += e.incomeAmount;
        costAmount += e.costAmount;
        profitAmount += e.profitAmount;

        this.profitData.push({ value: [e.date, e.profitAmount] });
        this.costData.push({ value: [e.date, e.costAmount] });
        this.incomeData.push({ value: [e.date, e.incomeAmount] });

      });

      this.depictC(this.profitChart, this.profitData, '#f53d3d', '收入');
      this.depictC(this.costChart, this.costData, '#3AE7C8', '支出');
      this.depictC(this.incomeChart, this.incomeData, '#DA71D6', '盈亏');
    } else {
      saleCard = res.saleCard;
      rechargeCard = res.rechargeCard;
      asorder = res.asorder;
      offsin = res.offsin;
      journalin = res.journalin;
      stocksale = res.stocksale;
      retreatCard = res.retreatCard;
      stockin = res.stockin;
      offsout = res.offsout;
      journalout = res.journalout;

      incomeAmount = res.incomeAmount;
      costAmount = res.costAmount;
      profitAmount = res.profitAmount;


      let projeN = [];
      let projeInfo = [];
      res.incomes.forEach(c => {
        projeN.push(c.incomeTypeName);
        projeInfo.push({ value: c.amount, name: c.incomeTypeName });
      });

      this.cakeData.projeN = projeN;
      this.cakeData.projeInfo = projeInfo;

      this.depictCake();
    }

    incomeArry = [
      { paymentName: "会员卡售卡", amount: saleCard },
      { paymentName: "会员卡充值", amount: rechargeCard },
      { paymentName: "订单实收", amount: asorder },
      { paymentName: "销账实收", amount: offsin },
      { paymentName: "记一笔实收", amount: journalin },
      { paymentName: "库存销售", amount: stocksale }
    ];

    costArry = [
      { paymentName: "会员卡退款", amount: retreatCard },
      { paymentName: "采购", amount: stockin },
      { paymentName: "销账实付", amount: offsout },
      { paymentName: "记一笔", amount: journalout },
    ];

    this.incomeInfo.incomeAmount = incomeAmount;
    this.incomeInfo.costAmount = costAmount;
    this.incomeInfo.profitAmount = profitAmount;
    this.incomeInfo.incomeArry = incomeArry;
    this.incomeInfo.costArry = costArry;

  }

  depictC(chart, arr, color, title, ) {
    let curtt = this.datePipe.transform(new Date(), "yyyy/MM/dd");

    let for30;
    if (this.segmentType == '近半年') {
      for30 = this.datePipe.transform(this.csbzNave.ionDateTool(new Date(), 6, 'm', '-'), "yyyy/MM/dd");
    } else {
      for30 = this.datePipe.transform(this.csbzNave.ionDateTool(new Date(), 30, 'd', '-'), "yyyy/MM/dd");
    }


    if (chart) {

      arr.unshift({ value: [for30] });
      arr.push({ value: [curtt] });


      let eChart = ECharts.init(chart.nativeElement);
      let option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '15%',
          right: '5%',
          top: '15%',
          bottom: '15%'
        },
        legend: {
          data: [title],
          left: 'right'
        },
        color: [color],
        xAxis: {
          type: 'time',
          splitNumber: 5
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '￥{value}',
          }
        },
        series: [{
          name: title,
          data: arr,
          type: 'line',
          smooth: true
        }]
      };
      eChart.setOption(option);
    }
  }

  depictCake() {
    let eChart = ECharts.init(this.cakeChart.nativeElement);
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: "{b} <br/>{c} ({d}%)"
      },
      legend: {
        orient: 'horizontal',
        width: '50%',
        top: "middle",
        x: 'right',
        data: this.cakeData.projeN
      },
      color: ['#755CFA', '#2885EA', '#2AE8C8', '#F78E67', '#F47A83', '#C77AFF', '#28B8EA', '#6BE895', '#F7BF66', '#F68DB2', '#FFFF19'],
      series: [
        {
          type: 'pie',
          radius: ['60%', '80%'],
          center: ['26%', '50%'],
          avoidLabelOverlap: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              formatter: "今日\n收入组成",
              textStyle: {
                fontSize: '20',
                color: '#555'
              }
            },

          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: this.cakeData.projeInfo
        }
      ]
    };
    eChart.setOption(option);
  }


}
