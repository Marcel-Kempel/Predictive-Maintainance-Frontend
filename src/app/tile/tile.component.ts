import { Component } from '@angular/core';

@Component({
    selector: 'app-tile',
    templateUrl: './tile.component.html',
    styleUrls: ['./tile.component.css']
})
export class TileComponent {
    isFlipped = false;

    flipCard() {
        this.isFlipped = !this.isFlipped;
    }
}
