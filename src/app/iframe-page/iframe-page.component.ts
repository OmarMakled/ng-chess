import { Component, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.css']
})
export class IframePageComponent {
  isReverse: boolean = false;
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;
  constructor( 
    private cdref: ChangeDetectorRef, 
  ) {}

  // Listen for messages from the parent window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    const {type, state} = event.data;
    if (type === 'start') {
      this.board.setFEN(state)
    }
    if (type === 'reverse') {
      this.board.reverse();
      this.cdref.detectChanges();
    }
  }
  onMove() {
    const state = this.board.getFEN();
    window.parent.postMessage({ type: 'move', state }, '*');
  }
}
