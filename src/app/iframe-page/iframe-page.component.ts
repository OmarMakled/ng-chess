import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.css']
})
export class IframePageComponent {
  isReverse: boolean = false;
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;
  constructor( private cdref: ChangeDetectorRef, private route: ActivatedRoute ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.isReverse = params['reverse'] ?? false;
    }); 
  }  
  onMove() {
    const history = this.board.getMoveHistory();
    const state = this.board.getFEN();
    localStorage.setItem('board', state);
    console.log(state, history);
  }
  ngAfterViewInit(){
    const state = localStorage.getItem('board');
    if (state) {
      this.board.setFEN(state);
    }
    if (this.isReverse){
      this.board.reverse();
    }
    this.cdref.detectChanges();
  }
}
