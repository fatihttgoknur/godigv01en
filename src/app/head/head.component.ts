import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-head',
  imports: [RouterModule],
  template: `
    <header style="border-bottom: 1px solid black;">
      <section>
        <a [routerLink]="['/']">
          <img src="/images/godig_logo.png" />
        </a>
      </section>
      <section></section>
    </header>
  `,
  styleUrl: './head.component.css'
})
export class HeadComponent {

}
