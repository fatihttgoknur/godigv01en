import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeadComponent } from '../head/head.component';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, HeadComponent],
  template: `
    <div class="mainDiv">
        <app-head></app-head>
        <router-outlet />
    </div>
  `,
  styles: `
    .mainDiv {
      display:flex;
      flex-direction:column;
      align-items: left;
      max-width: 700px;
      margin:auto;
    }
  `
})
export class MainComponent {
  title = 'Company Digital - Home'
}
