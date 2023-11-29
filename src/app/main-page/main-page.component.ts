import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  iframePlayerOneUrl: SafeResourceUrl;
  iframePlayerTwoUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.iframePlayerOneUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/iframepage');
    this.iframePlayerTwoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/iframepage?reverse=true');
  }
}
