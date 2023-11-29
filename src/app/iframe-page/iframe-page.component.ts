import { Component, ChangeDetectorRef, ViewChild, HostListener } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.css']
})
export class IframePageComponent {
  isReverse: boolean = false;
  game: any = {};
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;
  constructor( 
    private cdref: ChangeDetectorRef, 
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isReverse = params['reverse'] ?? false
    }); 
  }

  // Listen for messages from the parent window
  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (event.data.type === 'initialState') {
      this.game = event.data.data;
      this.board.setFEN(this.game.state)
    }
  }
  onMove() {
    // const history = this.board.getMoveHistory();
    const state = this.board.getFEN();
    // this.moveEvent.emit(state);
    window.parent.postMessage({ type: 'moveEvent', data: state }, '*');

    // localStorage.setItem('board', state);
    console.log(state);
  }
  ngAfterViewInit(){
    // const state = localStorage.getItem('board');
    // this.firebaseService.getGames()
    //   .subscribe(res => console.log(res))
    // if (state) {
    //   this.board.setFEN(state);
    // }
    if (this.isReverse){
      this.board.reverse();
    }
    this.cdref.detectChanges();
  }
}
