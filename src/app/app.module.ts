import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthModule } from '@auth0/auth0-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    AuthModule.forRoot({
      domain: 'dev-kt2aisrs.us.auth0.com',
      clientId: 'UnQQrQbXfHNwhBXOXmzuNW2ppPDCC8V0'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
