import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  iframePlayerOneUrl: SafeResourceUrl;
  iframePlayerTwoUrl: SafeResourceUrl;
  gameId: string = '';
  game: any = {};

  constructor(private sanitizer: DomSanitizer,  private firebaseService: FirebaseService) {
    this.iframePlayerOneUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/iframepage');
    this.iframePlayerTwoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/iframepage?reverse=true');
  }

  ngOnInit() {
    window.addEventListener('message', this.handleMoveEvent.bind(this));
    this.gameId = localStorage.getItem('gameId') ?? ''
    this.getGame();
  }

  createGame() {
    this.firebaseService.createGame({}).then((result) => {
      this.gameId = result.id;
      localStorage.setItem('gameId', this.gameId);
    });
  }

  joinGame() {
    this.getGame();
    localStorage.setItem('gameId', this.gameId);
  }
  
  handleMoveEvent(event: MessageEvent) {
    if (event.data.type === 'moveEvent') {
      const state = event.data.data;
      console.log('Received state update:', state, 'for game ID:', this.gameId);
      this.firebaseService.updateGameById(this.gameId, {
        state
      })
    }
  }

  getGame(){
    if (this.gameId){
      this.firebaseService.getGameById(this.gameId).then(result => {
        this.game = result
        const iframe = document.getElementById('iframeId') as HTMLIFrameElement;
        iframe.contentWindow?.postMessage({ type: 'initialState', data: this.game }, '*');
      })  
    }
  }
}
