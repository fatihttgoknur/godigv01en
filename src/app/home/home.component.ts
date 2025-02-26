import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  template: `
    <div class="divHomeMain">
      <section class="link-type1-section" [routerLink]="['/proforma']">
        <img src="/images/bill.png" />
        <span>Teklifler</span>
      </section>
      <section class="link-type1-section" [routerLink]="['/database']">
        <img src="/images/database-file.png" />
        <span>Veritabanı</span>
      </section>
    </div>
  `,
  styles: `
    .divHomeMain {
      margin-top: 50px;
      display: flex;
      align-items: left;
    }
  `
})
export class HomeComponent {

}
