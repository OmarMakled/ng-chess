import { Component, ViewChild, HostListener } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.css']
})
export class IframePageComponent {
  isReverse: boolean = false;
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  // Listen for messages from the parent window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    const {type, state, reverse} = event.data;
    console.log(event.data)
    if (type === 'play') {
      this.board.setFEN(state)
      if (reverse) {
        this.board.reverse();
      }
    }

    if (type === 'reset') {
      this.board.reset()
    }
  }
  onMove() {
    const state = this.board.getFEN();
    window.parent.postMessage({ type: 'move', state }, '*');
  }
}
