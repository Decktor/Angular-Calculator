import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalcService {
  private _currentNumberString = '0';
  private _lastNum = 0;
  private _currentOperation = '';
  private _isFirstDigit = true;
  private _currentNumberSub = new Subject<string>();
  currentNumberSub = this._currentNumberSub.asObservable();

  constructor() { }

  addDigit(num: string) {
    let dotIndex = this._currentNumberString.indexOf('.');
    if (dotIndex !== -1 && num === '.' && !this._isFirstDigit) {
      return;
    }
    if (this._isFirstDigit) {
      this._currentNumberString = num;
      this._isFirstDigit = false;
    } else {
      this._currentNumberString += num;
    }
    if (this._currentNumberString === '.') {
      this._currentNumberString = '0.';
    }
    if (this._currentNumberString[0] === '0' && this._currentNumberString.length > 1 && this._currentNumberString[1] !== '.') {
      this._currentNumberString = this._currentNumberString.slice(1, this._currentNumberString.length)
    }
    this.broadCastNumber();
  }

  clearAll() {
    this._currentNumberString = '0';
    this._lastNum = 0;
    this._currentOperation = '';
    this._isFirstDigit = true;
    this.broadCastNumber();
  }

  clearCurrentNum() {
    this._currentNumberString = '0';
    this.broadCastNumber();
  }

  invertSign() {
    let num = this.getCurrentNumAsFloat();
    num *= -1;
    this._currentNumberString = num.toString();
    this.broadCastNumber();
  }

  calcPercent() {
    this._currentNumberString = '' + (this.getCurrentNumAsFloat() / 100);
    this.broadCastNumber();
  }

  removeLastDigit() {
    if (this._currentNumberString.length > 0) {
      this._currentNumberString = this._currentNumberString.slice(0, this._currentNumberString.length -1);
    }
    if (this._currentNumberString.length === 0) {
      this._currentNumberString = '0';
    }
    this.broadCastNumber();
  }

  setOrPerformOperation(operation: string) {
    if (this._currentOperation !== '' && !this._isFirstDigit) {
      this.performOperation();
      this._currentOperation = '';
    }

    if (operation !== '=') {
      this._currentOperation = operation;
    }

    this._isFirstDigit = true;
    this._lastNum = this._currentNumberString === '∞' ? 0 : this.getCurrentNumAsFloat();
    this.broadCastNumber(true);
  }

  private broadCastNumber(removeTrailingZeroes = false) {
    let numToBroadcast = this.getNumWithCommas(removeTrailingZeroes);
    if (removeTrailingZeroes && numToBroadcast.indexOf('.') !== -1) {
      while (numToBroadcast[numToBroadcast.length - 1] === '0') {
        numToBroadcast = numToBroadcast.slice(0, numToBroadcast.length -1);
      }
      if (numToBroadcast[numToBroadcast.length -1 ] === '.') {
        numToBroadcast = numToBroadcast.slice(0, numToBroadcast.length -1);
      }
    }
    if (numToBroadcast.indexOf('.') !== -1) {
      while (numToBroadcast.indexOf('.') < numToBroadcast.length - 7) {
        numToBroadcast = numToBroadcast.slice(0, numToBroadcast.length -1)
      }
    }
    this._currentNumberSub.next(numToBroadcast);
  }

  private getNumWithCommas(removeTrailingZeroes = false) {
    if (this._currentNumberString === '∞') {
      return '∞';
    }
    var tempNumstring = removeTrailingZeroes ? this.getCurrentNumAsFloat().toFixed(6)  : this._currentNumberString;
    var parts = tempNumstring.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  private getCurrentNumAsFloat() {
    let currentNumberFloat = parseFloat(parseFloat(this._currentNumberString).toString());
    return currentNumberFloat;
  }

  private performOperation() {
    let currentNumberFloat = this.getCurrentNumAsFloat();
    switch (this._currentOperation) {
      case '/':
        if (this._currentNumberString === '0') {
          this._currentNumberString = '∞';
        } else {
          this._currentNumberString = (this._lastNum / currentNumberFloat).toString();
        }
        break;
      case '*':
        this._currentNumberString = (this._lastNum * currentNumberFloat).toString();
        break;
      case '-':
        this._currentNumberString = (this._lastNum - currentNumberFloat).toString();
        break;
      case '+':
        this._currentNumberString = (this._lastNum + currentNumberFloat).toString();
        break;
      default:
    }
  }
}
