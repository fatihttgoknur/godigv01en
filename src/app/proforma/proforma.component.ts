import { Component, inject, numberAttribute } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
          <div class="tableTopMain">
            <button type="button" class="btn btn-success" [routerLink]="['/proforma/new']">+ Yeni Ekle</button>
            <div class="form-check">
              <form [formGroup]="fgShowDeleted">
              <input class="form-check-input" formControlName="fcShowDeleted"  type="checkbox" (change)="toggleShowDeleted()" value="" id="flexCheckDefault">
              </form>
              <label class="form-check-label" for="flexCheckDefault">
                Silinenleri göster
              </label>
            </div>
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
                  <tr class="{{ mProforma.detailsOpen ? 'css-noBottomBorder' : '' }}" [classList]="mProforma.deactive ? 'grayed' : ''">
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
                        @if (!mProforma.deactive) {
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/revision.png" class="css-intable-img" title="Revize et" />
                          <span>Revize et</span>
                        </div>
                        }
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/printer.png" class="css-intable-img" title="Evrak" />
                          <span>Evrak</span>
                        </div>
                        @if (!mProforma.deactive) {
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/agreement.png" class="css-intable-img" title="Sipariş oluştur" />
                          <span>Sipariş oluştur</span>
                        </div>
                        <div class="css-detailElement" [routerLink]="['/proforma', mProforma.id]">
                          <img src="/images/delete.png" class="css-intable-img"title="Sil" />
                          <span>Sil</span>
                        </div>
                        }
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
        <section>
          <h2>Proforma #{{ this.proformaDetail?.id }}, {{proformaDetail?.customer?.name}}</h2>
          <div class="css-div-form">
            <!--<form [formGroup]="fgEditMachineModel" (submit)="editMachineModel()">-->
              <form>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">Tarih:</label>
                  <div class="col-sm-7">
                    {{ (this.proformaDetail && this.proformaDetail.createdDate) ? mService.formatDate(this.proformaDetail.createdDate, 1) : '' }}
                  </div>
                </div>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">Son Geçerlilik:</label>
                  <div class="col-sm-7">
                    {{ (this.proformaDetail && this.proformaDetail.validUntil) ? mService.formatDate(this.proformaDetail.validUntil, 1) : '' }}
                  </div>
                </div>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">Oluşturan:</label>
                  <div class="col-sm-7">
                    {{ (this.proformaDetail) ? this.proformaDetail.createdBy.userName : '' }}
                  </div>
                </div>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">İçerik:</label>
                  <div class="col-sm-7">
                  </div>
                </div>
                <div class="outer">
                <table class="table css-small-font">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Ürün / Servis</th>
                      <th scope="col">Liste Fiyatı</th>
                      <th scope="col">Birim Fiyat</th>
                      <th scope="col">Adet</th>
                      <th scope="col">Toplam</th>
                      <th scope="col">Termin</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (pMachine of proformaDetail?.machines; track pMachine; let idx = $index) {
                      <tr>
                        <td>{{idx + 1}}</td>
                        <td>
                          {{ pMachine.machine.name }}
                        </td>
                        <td class="alignRight">
                          @if (pMachine.listPriceBefore != pMachine.listPriceNow) {
                            <span title="eski">
                              {{pMachine.listPriceBefore}}
                            </span>
                              | 
                            <span title="güncel">
                              {{pMachine.listPriceNow}}
                            </span>
                          }
                          @else {
                            {{pMachine.listPriceBefore}}
                          }
                        </td>
                        <td class="alignRight">{{ pMachine.unitPrice }}</td>
                        <td class="alignRight">{{  pMachine.quantity }}</td>
                        <td class="alignRight">{{ pMachine.unitPrice * pMachine.quantity }}</td>
                        <td>
                          {{ showTermin(pMachine.terminDays) }}
                        </td>
                      </tr>
                      @if (pMachine.notes && pMachine.notes.length > 0) {
                      <tr>
                        <td></td>
                        <td colspan="6">
                          <div class="css-proforma-notes">
                            @for (note of pMachine.notes; track note) {
                              <div class="css-proforma-note">* {{note}}</div>
                            }
                          </div>
                        </td>
                      </tr>
                      }
                    }
                    @for (pPart of proformaDetail?.parts; track pPart; let idx = $index) {
                      <tr>
                        <td>{{ (proformaDetail?.machines?.length ?? 0) + idx + 1 }}</td>
                        <td>{{ pPart.part.name }}</td>
                        @if (pPart.listPriceBefore != pPart.listPriceNow) {
                          <td class="alignRight">
                            <span title="eski">{{ pPart.listPriceBefore }}</span> | 
                            <span title="güncel">{{ pPart.listPriceNow }}</span>
                          </td>
                        }
                        @else {
                          <td class="alignRight">{{ pPart.listPriceBefore }}</td>
                        }
                        <td class="alignRight">{{  pPart.unitPrice }}</td>
                        <td class="alignRight">{{  pPart.quantity }}</td>
                        <td class="alignRight">{{ pPart.unitPrice * pPart.quantity }}</td>
                        <td>
                          {{ showTermin(pPart.terminDays) }}
                        </td>
                      </tr>
                      @if (pPart.notes && pPart.notes.length > 0) {
                      <tr>
                        <td></td>
                        <td colspan="6">
                          <div class="css-proforma-notes">
                            @for (note of pPart.notes; track note) {
                              <div class="css-proforma-note">* {{ note }}</div>
                            }
                          </div>
                        </td>
                      </tr>
                      }
                    }
                    @for (pService of proformaDetail?.services; track pService; let idx = $index) {
                      <tr>
                        <td>
                          {{ (proformaDetail?.machines?.length ?? 0) + (proformaDetail?.parts?.length ?? 0) + idx + 1 }}
                        </td>
                        <td>{{ pService.service.name }}</td>
                        @if (pService.listPriceBefore != pService.listPriceNow) {
                          <td class="alignRight">
                          <span title="eski">{{ pService.listPriceBefore }}</span> | 
                          <span title="güncel">{{ pService.listPriceNow }}</span>
                          </td>
                        }
                        @else {
                          <td class="alignRight">{{ pService.listPriceBefore }}</td>
                        }
                        <td class="alignRight">{{ pService.unitPrice }}</td>
                        <td class="alignRight">{{ pService.quantity }}</td>
                        <td class="alignRight">{{ pService.unitPrice * pService.quantity }}</td>
                        <td>
                          {{ showTermin(pService.terminDays) }}
                        </td>
                      </tr>
                      @if (pService.notes && pService.notes.length > 0) {
                      <tr>
                        <td></td>
                        <td colspan="6">
                          <div class="css-proforma-notes">
                            @for (note of pService.notes; track note) {
                              <div class="css-proforma-note">* {{ note }}</div>
                            }
                          </div>
                        </td>
                      </tr>
                      }
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="7"></td>
                    </tr>
                    <tr>
                      <td class="css-td-right" colspan="5">Ara Toplam:</td>
                      <td class="alignRight">{{proformaDetail ? this.mService.giveTotalPrice(proformaDetail, true): ''}} $</td>
                      <td></td>
                    </tr>
                    <tr>
                      <td class="css-td-right" colspan="5">İskonto:</td>
                      <td class="alignRight">{{ proformaDetail?.percentDiscount ?? 0 }} %</td>
                      <td></td>
                    </tr>
                    <tr class="css-bold">
                      <td class="css-td-right" colspan="5">Genel Toplam:</td>
                      <td class="alignRight">{{proformaDetail ? this.mService.giveTotalPrice(proformaDetail): ''}} $</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
                </div>
                @if (proformaDetail && proformaDetail.notes && proformaDetail.notes.length + (N1var ? 1 : 0) > 0) {
                  <div class="row mb-3">
                  <label class="col-sm-3 col-form-label">Notlar:</label>
                  <div class="col-sm-9">
                    @if (this.N1var) {
                      <div class="css-proforma-note">**N1: siparişten sonra programlanacaktır.</div>
                    }
                    @for (note of proformaDetail.notes; track note) {
                      <div class="css-proforma-note">* {{note}}</div>
                    }
                  </div>
                </div>
                }
              </form>
          </div>
        </section>
      }
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
    .tableTopMain {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
    }
    .tableTopMain > * {
      margin: 0 10px;
    }
    tr.grayed > td { 
      color:rgb(224, 135, 135); 
    }
    .css-td-right {
      text-align: right;
    }
    .css-bold {
      font-weight: bold;
    }
    .table tbody tr td {
      border-style: solid;
      border-width: 1px;
    }
    .alignRight > span {
      text-align: right;
    }
    .css-proforma-note {
      font-style: italic;
    }
    div.outer:has( > .table) {
      border: 1px solid black;
    }
  `
})
export class ProformaComponent {

  detailId = -1;
  
  mStyle = 0;
  
  changeActive = false;

  newRecord = false;
  N1var = false;

  fgShowDeleted = new FormGroup({
    fcShowDeleted: new FormControl(false)
  });

  fgProformaDetail = new FormGroup({}
  )

  showDeactives = false;

  mService: GodisService = inject(GodisService);

  proformaShortList = this.mService.getProformaShortList(this.showDeactives);
  
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

    if (!this.proformaShortList) return;

    for (var mProforma of this.proformaShortList) {
      if (mProforma.id === proformaId) {
        if (mProforma.detailsOpen) mProforma.detailsOpen = false;
        else mProforma.detailsOpen = true;
      }
      else mProforma.detailsOpen = false;
    }
  }

  showTermin(terminDays?: number): string {
    switch (terminDays) {
      case undefined:
        return '-';
      case -1:
        this.N1var = true;
        return '**N1';
      case 0:
        return 'stok';
      default:
        return terminDays + ' gün'
    }
  }

  toggleShowDeleted() {
    const show = this.fgShowDeleted.value.fcShowDeleted;
    
    this.proformaShortList = this.mService.getProformaShortList(show ?? false);
  }

}
