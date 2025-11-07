import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TileComponent } from './tile/tile.component';
import { LiveFlowComponent } from './live-flow/live-flow.component';


@NgModule({
    declarations: [AppComponent, TileComponent, LiveFlowComponent],
    imports: [BrowserModule],
    bootstrap: [AppComponent]
})
export class AppModule { }