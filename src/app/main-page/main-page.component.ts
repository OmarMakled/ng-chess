import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseService } from '../firebase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  iframePlayerOneUrl: SafeResourceUrl;
  iframePlayerTwoUrl: SafeResourceUrl;
  gameId: string = localStorage.getItem('gameId') ?? '';
  reverse: string = localStorage.getItem('reverse') ?? ''
  gameSubscription: Subscription = new Subscription();

  constructor(private sanitizer: DomSanitizer,  private firebaseService: FirebaseService) {
    this.iframePlayerOneUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/iframepage');
    this.iframePlayerTwoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/iframepage');
  }

  ngOnInit() {
    window.addEventListener('message', this.handleMoveEvent.bind(this));
    this.getGame();
  }

  postMessage(message: any){
    const iframe = document.getElementById('iframeId') as HTMLIFrameElement;
    iframe.contentWindow?.postMessage({... message, reverse: this.reverse}, '*');
  }

  createGame() {
    this.firebaseService.createGame({}).then((result) => {
      this.gameId = result.id;
      localStorage.setItem('gameId', this.gameId);

      this.postMessage({ type: 'reset' });
    });
  }

  joinGame() {
    this.reverse = 'true';
    localStorage.setItem('reverse', 'true');

    this.getGame();
  }
  
  handleMoveEvent(event: MessageEvent) {
    const {type, state} = event.data;
    if (type === 'move') {
      this.firebaseService.updateGameById(this.gameId, {state})
    }
  }

  getGame(){
    if(this.gameId){
      this.firebaseService.getGameById(this.gameId).then((data: any) => {
        localStorage.setItem('gameId', this.gameId);
        this.watch();
      })  
    }
  }

  watch() {
    this.gameSubscription = this.firebaseService.onGameUpdate(this.gameId).subscribe((data: any) => {
      console.log('watch', data)
      this.postMessage({ type: 'play', state: data.state });
    });
  }

  ngOnDestroy() {
    if (this.gameSubscription) {
      this.gameSubscription.unsubscribe();
    }
  }
}
