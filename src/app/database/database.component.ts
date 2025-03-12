import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-database',
  imports: [RouterModule],
  template: `
    <div class="divDatabaseMain">
    <section class="link-type1-section" [routerLink]="['/db-customers']">
        <img src="/images/customers.png" />
        <span>Customers</span>
      </section>
      <section class="link-type1-section" [routerLink]="['/db-machines']">
        <img src="/images/factory-machine.png" />
        <span>Machine Models</span>
      </section>
      <section class="link-type1-section" [routerLink]="['/db-parts']">
        <img src="/images/spare-parts.png" />
        <span>Spare Parts</span>
      </section>
      <section class="link-type1-section" [routerLink]="['/db-services']">
        <img src="/images/customer-service.png" />
        <span>Services</span>
      </section>
    </div>
  `,
  styles: `
    .divDatabaseMain {
      display: flex;
      flex-direction: row;
      margin-top: 20px
    }
  `
})
export class DatabaseComponent {

}
