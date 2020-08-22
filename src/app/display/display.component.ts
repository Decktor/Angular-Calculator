import { Component, OnInit, OnDestroy } from '@angular/core';
import { CalcService } from '../calcService/calc.service'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})

export class DisplayComponent implements OnInit, OnDestroy {

  constructor(public calcService: CalcService) { }
  currentNum: string = '0';
  currentNumSubscription: Subscription;

  ngOnInit(): void {
    this.currentNumSubscription = this.calcService.currentNumberSub.subscribe((num: string) => {
      this.currentNum = num;
    });
  }

  getFontSize() {
    let size = 75;
    if (this.currentNum.length > 10) {
      size *= 10 / (this.currentNum.length * .95)
    }
    return size;
  }

  getLineHeight() {
    return 120/this.getFontSize();
  }

  ngOnDestroy() {
    this.currentNumSubscription.unsubscribe();
  }

}
