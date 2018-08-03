import { Component, Input } from '@angular/core';

@Component({
  selector: 'img-lazy-load',
  templateUrl: 'img-lazy-load.html'
})
export class ImgLazyLoadComponent {

  default: string = 'assets/icon/favicon.ico';

  constructor() {
    
  }

  @Input() src: string //要显示的图片

  ngOnInit() {
    let img = new Image();
    img.src = this.src;
    img.onload = () => {
      this.default = this.src;
    }
  }

}
