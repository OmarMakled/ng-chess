import { Component, ViewChild, HostListener } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { AppEvent } from '../app.config';

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.css'],
})
export class IframePageComponent {
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  // Listen for messages from the parent window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    const { type, state, reverse } = event.data;
    if (type === AppEvent.PLAY) {
      this.board.setFEN(state);
      if (reverse) {
        this.board.reverse();
      }
    }
    if (type === AppEvent.RESET) {
      this.board.reset();
    }
  }
  onMove() {
    const state = this.board.getFEN();
    const { mate } = this.board.getMoveHistory().slice(-1)[0];
    window.parent.postMessage({ type: AppEvent.MOVE, state, mate }, '*');
  }
}
