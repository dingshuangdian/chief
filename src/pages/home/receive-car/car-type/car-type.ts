import { Component, ViewChildren, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';

import { resourcesStaticProvider } from '../../../../providers/resources-static'

import { carTypeItemPage } from './car-type-item/car-type-item';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { AutoMake } from './autoInfo';
import { catchError, tap, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { WebSites } from '../../../../providers/web-sites';
import { WebConfig } from '../../../../providers/web-config';


@Component({
  selector: 'page-car-type',
  templateUrl: 'car-type.html',
})
export class carTypePage {

  callback;

  indexes: Array<string> = [];
  cars: Array<any> = [];
  filterCars: Array<any> = [];


  filterCars$: Observable<AutoMake[]>;
  private searchTerms = new Subject<string>();

  @ViewChildren('carGroup') carGroup;
  @ViewChild(Content) content: Content;

  img_path = WebConfig.img_path;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public carTypeData: resourcesStaticProvider,
    public websites: WebSites) {
    this.callback = this.navParams.get("callback");
  }

  ionViewDidLoad() {

    this.filterCars$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.searchAutoMake(term)),
    );

    // this.carTypeData.load().subscribe({
    //   next: (data: any) => {
    //     this.indexes = data.indexes;
    //     this.cars = data.groupCars;
    //   },
    //   complete: () => {
    //     console.log('complete');
    //   },
    //   error: (error: any) => {

    //   }
    // }
    // );

    this.carTypeData.load().subscribe(res => {
      this.indexes = res.indexes;
      this.cars = res.groupCars;
    }, error => {
      console.log(error);
    })



    var $this = this;
    function alphabetMove(e, move) {
      var pPositionY = e.changedTouches[0].clientY
      var currentItem, targetItem;
      var d = document;
      currentItem = d.elementFromPoint(d.body.clientWidth - 1, pPositionY);
      if (!currentItem || currentItem.className.indexOf('index-bar') < 0) return;
      targetItem = document.getElementById(currentItem.innerText);
      document.getElementById('indexs-title').style.display = 'block'
      document.getElementById('indexs-title').innerText = currentItem.innerText;
      if (move) {
        var index = $this.indexes.join('').indexOf(currentItem.innerText);
        $this.content.scrollTo(0, $this.carGroup._results[index].nativeElement.offsetTop, 300);
      }
    }

    var indexsBar = document.getElementById('indexs-bar');
    indexsBar.addEventListener('touchstart', function (e) {
      alphabetMove(e, false);
    });
    indexsBar.addEventListener('touchmove', e => {
      alphabetMove(e, false);
    });
    indexsBar.addEventListener('touchend', function (e) {
      alphabetMove(e, true);
      document.getElementById('indexs-title').style.display = 'none';
    });
  }

  typeSelect(c) {
    let carType: object = { 'automake': c };
    this.navCtrl.push(carTypeItemPage, { callback: this.callback, automakeId: c.automakeId, carType: carType });
  }

  myHeaderFn(record, recordIndex, records) {
    return record.firstLetter;
  }

  getItems(e) {
    var newVal = e.target.value;
    if (newVal) {
      this.filterCars = this.carTypeData.filterCars(newVal);
    }
    else {
      this.filterCars = [];
    }
    this.content.scrollToTop(500);
  }


  search(term: string): void {
    // this.getItems(term);
    this.searchTerms.next(term);
  }


  searchAutoMake(term: string): Observable<AutoMake[]> {
    if (!term.trim()) {
      return of([]);
    }

    return of(this.carTypeData.filterCars(term));

    // return this.websites.httpPost("findautotypeKeyword", { keyWords: term });
  }

}
