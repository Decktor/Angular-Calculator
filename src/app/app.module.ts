import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DisplayComponent } from './display/display.component';
import { KeypadComponent } from './keypad/keypad.component';
import { CalcService } from './calcService/calc.service'

@NgModule({
  declarations: [
    AppComponent,
    DisplayComponent,
    KeypadComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [CalcService],
  bootstrap: [AppComponent]
})
export class AppModule { }
