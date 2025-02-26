import { Component, inject, numberAttribute } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GodisService } from '../godis.service';
import { Proforma } from '../godid';
import { CustomerComponent } from '../customer/customer.component';
CustomerComponent

@Component({
  selector: 'app-proforma',
  imports: [RouterModule, ReactiveFormsModule, CustomerComponent],
  template: `
    <div class="proforma-main">
      @if (!this.detailId && this.detailId != 0) {
        <section class="css-table-manage">
          <div>
            <button type="button" class="btn btn-success" [routerLink]="['/proforma/new']">+ Yeni Ekle</button>
          </div>
        </section>
        <section class="table">
          @if (!this.proformaShortList || this.proformaShortList.length < 1) {
              <div>Henüz proforma yok.</div>
          }
          @else {
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Firma</th>
                  <th scope="col">Tarih</th>
                  <th scope="col">Fiyat ($)</th>
                  <th scope="col">Oluşturan</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                @for (mProforma of this.proformaShortList; track mProforma) {
                  <tr class="{{ mProforma.detailsOpen ? 'css-noBottomBorder' : '' }}"  >
                    <td (click)="toggleDetails(mProforma.id)">{{ mProforma.id + 1 }}</td>
                    <td>
                      <app-customer customer_id="{{mProforma.customerId}}"></app-customer>
                    </td>
                    <td (click)="toggleDetails(mProforma.id)">{{ this.mService.formatDate(mProforma.createdDate) }}</td>
                    <td (click)="toggleDetails(mProforma.id)">{{ mProforma.totalPrice }}</td>
                    <td (click)="toggleDetails(mProforma.id)">{{ mProforma.createdBy.userName }}</td>
                    <td (click)="toggleDetails(mProforma.id)">
                      <img src="/images/arrow-{{ mProforma.detailsOpen ? 'up' : 'down'}}.png" class="css-intable-img" />
                    </td>
                  </tr>
                  <tr class="{{ mProforma.detailsOpen ? 'css-showDetails' : 'detail' }}">
                    <td colspan="6">
                      <div>
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/details.png" class="css-intable-img"  title="Detay" />
                          <span>Detay</span>
                        </div>
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/revision.png" class="css-intable-img" title="Revize et" />
                          <span>Revize et</span>
                        </div>
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/printer.png" class="css-intable-img" title="Evrak" />
                          <span>Evrak</span>
                        </div>
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/agreement.png" class="css-intable-img" title="Sipariş oluştur" />
                          <span>Sipariş oluştur</span>
                        </div>
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/delete.png" class="css-intable-img"title="Sil" />
                          <span>Sil</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          }
        </section>
      }
      @else {
        <section class="css-section-navi">
          <a [routerLink]="['/proforma']">
            Teklifler
          </a>
          <span>></span>
          <span>{{ this.newRecord ? "Yeni kayıt" : 'Proforma #' + proformaDetail?.id }}</span>
        </section>
      }
      <p>proforma works!</p>
    </div>
  `,
  styles: `
    .proforma-main {
      margin-top: 20px;
    }
    .detail {
      display: none;
    }
    .css-noBottomBorder, .css-noBottomBorder td {
      border-style: none;
    }
    .css-showDetails div {
      display: flex;
      flex-direction: row;
      align-items: right;
      justify-content: right;
    }
    .css-showDetails img {
      margin: 5px 10px;
    }
    .css-showDetails td, .css-noBottomBorder td {
      background-color:rgba(248, 223, 111, 0.77);
    }
    .css-detailElement {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: smaller;
      cursor: pointer;
      margin-right: 10px;
    }
    .css-detailElement span {
      margin-left: -5px;
    }
    .css-detailElement:hover {
    color: #2c5b93;
}
  `
})
export class ProformaComponent {

  detailId = -1;
  
  mStyle = 0;
  
  changeActive = false;

  newRecord = false;

  mService: GodisService = inject(GodisService);

  proformaShortList = this.mService.getProformaShortList();
  proformaDetail: Proforma | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.detailId = Number(this.route.snapshot.params["id"]);
    if (this.detailId || this.detailId === 0) {
      this.proformaDetail = this.mService.getProformaDetails(this.detailId);
    }
    else {
      this.proformaShortList = this.mService.getProformaShortList();
    }
  }

  toggleDetails(proformaId: number) {
    console.log("naber");

    if (!this.proformaShortList) return;

    for (var mProforma of this.proformaShortList) {
      if (mProforma.id === proformaId) {
        if (mProforma.detailsOpen) mProforma.detailsOpen = false;
        else mProforma.detailsOpen = true;
      }
      else mProforma.detailsOpen = false;
    }
  }

}
