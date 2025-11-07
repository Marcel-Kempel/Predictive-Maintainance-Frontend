import { Component } from '@angular/core';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    tiles = [
        { title: 'Parkverteilung', subtitle: 'Parkvorhersage', color: '#b07b1a' },
        { title: 'Temperaturen', subtitle: '2-Tage-Vorhersage', color: '#2b86b7' },
        { title: 'Umwelt', subtitle: 'Sensoren', color: '#2aa05a' },
        { title: 'Verkehr', subtitle: 'Aktuelle Werte', color: '#a54aa3' }
    ];
}