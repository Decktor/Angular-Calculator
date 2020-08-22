import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CalcService } from '../calcService/calc.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.css']
})

export class KeypadComponent implements OnInit, OnDestroy {

  currentNum: number;
  clearSymbol: string = 'AC';

  constructor(private calcService: CalcService) { }

  currentNumSubscription: Subscription;

  ngOnInit(): void {
    this.currentNumSubscription = this.calcService.currentNumberSub.subscribe((num: string) => {
      this.clearSymbol = num === '0' ? 'AC' : 'C';
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    let key = event.key;
    if (key >= '0' && key <= '9' || key === '.') {
      this.onClickNumKeys(key);
    } else {
      switch (key) {
        case '/':
          event.preventDefault();
        case '*':
        case '-':
        case '+':
        case '=':
          this.onClickOperation(key);
          break;
        case 'Delete':
          this.onClickClear();
          break;
        case 'Backspace':
          this.onBackSpace();
          break;
        case 'Enter':
          this.onClickOperation('=');
          break;
        default:
      }
    }
  }

  onClickOperation(operator: string) {
    this.calcService.setOrPerformOperation(operator);
  }

  onClickNumKeys(num: string) {
    this.calcService.addDigit(num);
  }

  onClickClear() {
    this.calcService.clear();
  }

  onBackSpace() {
    this.calcService.removeLastDigit();
  }

  onClickInvert() {
    this.calcService.invertSign();
  }

  onClickPercent() {
    this.calcService.calcPercent();
  }

  ngOnDestroy() {
    this.currentNumSubscription.unsubscribe();
  }
}
