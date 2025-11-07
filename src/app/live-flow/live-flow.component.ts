import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';


interface FlowItem { id: number; x: number; y: number; color?: string }


@Component({
    selector: 'app-live-flow',
    templateUrl: './live-flow.component.html',
    styleUrls: ['./live-flow.component.css']
})
export class LiveFlowComponent implements OnInit, OnDestroy {
    @ViewChild('container', { static: true }) container!: ElementRef<HTMLDivElement>;


    items: FlowItem[] = [];
    sub!: Subscription;
    idCounter = 1;


    ngOnInit() {
        // Simuliere eingehende Events: alle 800ms kommt ein Punkt
        this.sub = interval(800).subscribe(() => this.pushRandomItem());
        // Animationsloop: alle 50ms verschiebe Items nach links
        const move = interval(50).subscribe(() => this.tick());
        this.sub.add(move);
    }


    ngOnDestroy() {
        this.sub?.unsubscribe();
    }


    pushRandomItem() {
        const height = this.container.nativeElement.clientHeight;
        const y = Math.random() * (height - 20) + 8; // random vertical position
        const newItem: FlowItem = { id: this.idCounter++, x: this.container.nativeElement.clientWidth - 20, y, color: this.pickColor() };
        this.items.push(newItem);
        // begrenze Array-Größe
        if (this.items.length > 80) this.items.shift();
    }


    tick() {
        // verschiebe alle Items leicht nach links
        this.items.forEach(it => it.x -= 4);
        // entferne ausgebliebene Items
        this.items = this.items.filter(it => it.x > -20);
    }


    pickColor() { const colors = ['#f6b21a', '#6cd2ff', '#9be47a', '#ff7b7b']; return colors[Math.floor(Math.random() * colors.length)]; }
}