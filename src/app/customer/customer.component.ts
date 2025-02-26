import { Component, inject, Input, numberAttribute, OnInit} from '@angular/core';
import { GodisService } from '../godis.service';

@Component({
  selector: 'app-customer',
  imports: [],
  template:`
    <div class="customerAppMain">
      <div>{{ myDetail?.name ?? '-error-' }}</div>
      <div class="css-detailIcon">
        <img src="/images/red-flag.png" class="css-intable-img"  title="Detay" />
        <div class="css-details">
          <div class="css-details-element">helloo</div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .customerAppMain {
      display: flex;
      flex-direction: row;
      position: relative;
    }
    .css-detailIcon {
      visibility: hidden;
    }
    .customerAppMain:hover .css-detailIcon{
      visibility: visible;
      display: inline-block;
      float: right;
      width: max-content;
    }
    .css-detailIcon:hover .css-details {
      display: flex;
      flex-direction: column;
    }
    div:has(.css-detailIcon:hover) {
      background-color:red;
    }
    .css-details {
      position: absolute;
      left: 0;
      top: 20;
      background-color: blue;
      color: white;
      display:none;
      width: 100%
    }
  `
})
export class CustomerComponent {

  @Input({required: true, transform: numberAttribute}) customer_id!: number;

  mService: GodisService = inject(GodisService);

  myDetail: {id: number, name: string, proformaCount: number, purchaseCount: number, machineCount: number, detailsOpen: boolean} | undefined;

  constructor() {}

  ngOnInit() {
    this.myDetail = this.mService.getCustomerDetailComponent(this.customer_id);
  }
}
