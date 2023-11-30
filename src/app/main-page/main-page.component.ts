import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseService } from '../firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {
  iframePlayerOneUrl: SafeResourceUrl;
  gameId: string = '';
  reverse: string = '';
  gameSubscription: Subscription = new Subscription();
  gameMode: string = 'create';

  constructor(private sanitizer: DomSanitizer, private firebaseService: FirebaseService) {
    this.iframePlayerOneUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/iframepage');
  }

  ngOnInit() {
    window.addEventListener('message', this.handleMoveEvent.bind(this));
    this.initializeGame();
  }

  ngOnDestroy() {
    window.removeEventListener('message', this.handleMoveEvent.bind(this));
    this.unsubscribeGameUpdate();
  }

  postMessage(message: any) {
    const iframe = document.getElementById('iframeId') as HTMLIFrameElement;
    iframe.contentWindow?.postMessage({ ...message, reverse: this.reverse }, '*');
  }

  initializeGame() {
    this.gameId = localStorage.getItem('gameId') || '';
    this.reverse = localStorage.getItem('reverse') || '';

    if (this.gameId) {
      this.getGame();
    }
  }

  createGame() {
    this.firebaseService.createGame({}).then((result) => {
      this.reset(result.id);
      this.watchGame()
    }).catch(error => {
      console.error('Error create game:', error);
    });
  }

  reset(id: string) {
    this.gameId = id;
    localStorage.setItem('gameId', id);
    localStorage.removeItem('reverse');
    this.postMessage({ type: 'reset' });
  }

  joinGame() {
    this.reverse = 'true';
    localStorage.setItem('reverse', 'true');

    this.getGame();
  }

  handleMoveEvent(event: MessageEvent) {
    const { type, state, mate } = event.data;
    if (type === 'move') {
      this.firebaseService.updateGameById(this.gameId, { state, mate });
    }
  }

  getGame() {
    this.firebaseService.getGameById(this.gameId).then((data: any) => {
      this.watchGame();
    }).catch(error => {
      console.error('Error fetching game:', error);
    });
  }

  watchGame() {
    this.unsubscribeGameUpdate();

    this.gameSubscription = this.firebaseService.onGameUpdate(this.gameId).subscribe((data: any) => {
      console.log('Game updated:', data);
      const { state, mate } = data;
      this.postMessage({ type: 'play', state, mate });
      if (mate) {
        alert('Game end!');
      }
    });
  }

  unsubscribeGameUpdate() {
    if (this.gameSubscription && !this.gameSubscription.closed) {
      this.gameSubscription.unsubscribe();
    }
  }
}
