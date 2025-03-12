import { Component, inject, numberAttribute } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GodisService } from '../godis.service';
import { MachineModel, Part, Proforma, Service, Customer } from '../godid';
import { CustomerComponent } from '../customer/customer.component';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ProformaContentComponent } from '../proforma-content/proforma-content.component';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-proforma',
  imports: [RouterModule, ReactiveFormsModule, CustomerComponent, DatepickerComponent, ProformaContentComponent, FormsModule, MatIconModule],
  template: `
    <div class="proforma-main">
      <h3>PROFORMA SYSTEM</h3>
      @if (!this.detailId && this.detailId != 0 && !isNewProforma) {
        <section class="css-table-manage">
          <div class="tableTopMain">
            <button type="button" class="btn btn-success" [routerLink]="['/proforma/new']">+ Add New</button>
            <div class="form-check">
              <form [formGroup]="fgShowDeleted">
              <input class="form-check-input" formControlName="fcShowDeleted"  type="checkbox" (change)="toggleShowDeleted()" value="" id="flexCheckDefault">
              </form>
              <label class="form-check-label" for="flexCheckDefault">
                Show deleted
              </label>
            </div>
          </div>
        </section>
        <section class="table">
          @if (!this.proformaShortList || this.proformaShortList.length < 1) {
              <div>No proforma yet.</div>
          }
          @else {
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Company</th>
                  <th scope="col">Date</th>
                  <th scope="col">Price ($)</th>
                  <th scope="col">Created By</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                @for (mProforma of this.proformaShortList; track mProforma.id) {
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
                          <span>Detail</span>
                        </div>
                        <div class="css-detailElement" (click)="newTab(mProforma.id)">
                          <img src="/images/printer.png" class="css-intable-img" title="Evrak" />
                          <span>Document</span>
                        </div>
                        @if (!mProforma.deactive) {
                        <div class="css-detailElement" (click)="alertPhase2()">
                          <img src="/images/agreement.png" class="css-intable-img" title="Sipariş oluştur" />
                          <span>Create Purchase</span>
                        </div>
                        <div class="css-detailElement" (click)="deactivateProforma(mProforma.id)">
                          <img src="/images/delete.png" class="css-intable-img"title="Sil" />
                          <span>Delete</span>
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
      @else if (this.isNewProforma) {
        <section class="css-section-navi">
          <a [routerLink]="['/proforma']">
            Proformas
          </a>
          <span>></span>
          <span>New Proforma</span>
        </section>
        <section>
          <h2>New Proforma</h2>
          <h5 style="margin-top: 30px; margin-bottom:20px">Step.1 - Choose company</h5>
        </section>
        <section>
          <div class="input-group mb-3">
            <div style="margin-right: 20px;">Filter by Name: </div>
            <input [(ngModel)]="customerFilterText" type="text" class="form-control" placeholder="enter company name" aria-label="enter company name" (input)="filterCustomerChanging($event)" [ngModelOptions]="{standalone: true}"  aria-describedby="basic-addon1">
            <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1"><mat-icon aria-hidden="false" aria-label="Search" fontIcon="search"></mat-icon></span>
                </div>
          </div>
        </section>
        <section>
          @for (mCustomer of this.customersFiltered; track mCustomer.id; let idx = $index) {
            <div class="css-model" (click)="newProformaCustomerPicked(mCustomer)">{{mCustomer.name}}</div>
          }
        </section>
      }
      @else {
        <section class="css-section-navi">
          <a [routerLink]="['/proforma']">
            Proformas
          </a>
          <span>></span>
          <span>{{ detailId === -2 ? "Yeni Proforma" : 'Proforma #' + proformaDetail?.id }}</span>
        </section>
        <section>
          @if (detailId && detailId != -1) {
            @if (detailId === -2) {
            <h2>New proforma, {{proformaDetail?.customer?.name}}</h2>
            }
            @else {
              <h2>Proforma #{{ this.proformaDetail?.id }}, {{proformaDetail?.customer?.name}}</h2>
            }
          }
          @else {
            <h2>New proforma</h2>
          }
          <div class="css-div-form">
              <form>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">Date:</label>
                  <div class="col-sm-7">
                    @if (!changeActive && !newRecord) {
                      {{ (this.proformaDetail && this.proformaDetail.createdDate) ? mService.formatDate(this.proformaDetail.createdDate, 1) : '' }}
                    }
                    @else {
                      {{ this.mService.formatDate(mNow, 1) }}
                    }
                  </div>
                </div>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">Valid Until:</label>
                  <div class="col-sm-7">
                    @if (!changeActive && !newRecord) {
                      {{ (this.proformaDetail && this.proformaDetail.validUntil) ? mService.formatDate(this.proformaDetail.validUntil, 1) : '' }}
                    }
                    @else {
                      <app-datepicker [fInput]="'02.11.2025'" (selectedDate)="this.dateExpirePicker = $event"></app-datepicker>
                    }
                  </div>
                </div>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">Created By:</label>
                  <div class="col-sm-7">
                    {{ (this.proformaDetail) ? this.proformaDetail.createdBy.userName : '' }}
                  </div>
                </div>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">Contact Person:</label>
                  <div class="col-sm-7">
                    <input [(ngModel)]="proformaContactPerson" type="text" name="" id="" [ngModelOptions]="{standalone: true}" [disabled]="this.changeActive ? false : true" placeholder="contact person">
                  </div>
                </div>
                <div class="row mb-3 css-nomar">
                  <label class="col-sm-3 col-form-label">Contents:</label>

                  <div class="col-sm-7">
                    @if ((this.newRecord || this.changeActive) && ! this.proformaContentEdit) {
                      <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        + Ekle
                      </button>
                      <div class="dropdown-menu">
                          <!--<div class="dropdown-divider"></div>-->
                          <a class="dropdown-item" style="cursor: pointer;" (click)="addMachine()">Machine</a>
                          <a class="dropdown-item" style="cursor: pointer;" (click)="addPart()">Spare Part</a>
                          <a class="dropdown-item" style="cursor: pointer;" (click)="addService()">Service</a>
                      </div>
                    }
                  </div>
                </div>
                @if (!proformaContentEdit) {
                  <div class="outer css-inhalt">
                  <table class="table css-small-font">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product / Service</th>
                        <th scope="col">List Price</th>
                        <th scope="col">Unit Price</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Total</th>
                        <th scope="col">Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (pMachine of proformaDetail?.machines; track pMachine.machine.id; let idx = $index) {
                        <tr>
                          <td>{{idx + 1}}
                          @if (changeActive || newRecord) {
                              <img src="/images/edit-info.png" class="css-intable-img css-img-smll"title="Edit" (click)="editMachine(pMachine.machine.id)" />
                              <img src="/images/delete.png" class="css-intable-img css-img-smll" title="Delete" (click)="deleteMachine(pMachine.machine.id)" />
                            }
                          </td>
                          <td>
                            {{ pMachine.machine.name }}
                            
                          </td>
                          <td class="alignRight">
                            @if (pMachine.listPriceBefore != pMachine.listPriceNow) {
                              <span title="old">
                                {{pMachine.listPriceBefore}}
                              </span>
                                | 
                              <span title="actual">
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
                      @for (pPart of proformaDetail?.parts; track pPart.part.id; let idx = $index) {
                        <tr>
                          <td>
                            {{ (proformaDetail?.machines?.length ?? 0) + idx + 1 }}
                            @if (changeActive || newRecord) {
                              <img src="/images/edit-info.png" class="css-intable-img css-img-smll"title="Düzenle" (click)="editPart(pPart.part.id)" />
                              <img src="/images/delete.png" class="css-intable-img css-img-smll"title="Sil" (click)="deletePart(pPart.part.id)" />
                            }
                          </td>
                          <td>
                            {{ pPart.part.name }}
                          </td>
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
                        @if (pPart.notes && pPart.notes.length > 0 ) {
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
                      @for (pService of proformaDetail?.services; track pService.service.id; let idx = $index) {
                        <tr>
                          <td>
                            {{ (proformaDetail?.machines?.length ?? 0) + (proformaDetail?.parts?.length ?? 0) + idx + 1 }}
                            @if (changeActive || newRecord) {
                                <img src="/images/edit-info.png" class="css-intable-img css-img-smll"title="Düzenle" (click)="editService(pService.service.id)" />
                                <img src="/images/delete.png" class="css-intable-img css-img-smll"title="Sil" (click)="deleteService(pService.service.id)" />
                            }
                          </td>
                          <td>
                            {{ pService.service.name }}
                          </td>
                          @if (pService.listPriceBefore != pService.listPriceNow) {
                            <td class="alignRight">
                            <span title="old">{{ pService.listPriceBefore }}</span> | 
                            <span title="actual">{{ pService.listPriceNow }}</span>
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
                        <td class="css-td-right" colspan="5">Sub Total:</td>
                        <td class="alignRight">{{proformaDetail ? this.mService.giveTotalPrice(proformaDetail, true).toLocaleString("tr-TR", {style: 'currency', currency: 'USD'}): ''}} $</td>
                        <td></td>
                      </tr>
                      <tr>
                        <td class="css-td-right" colspan="5">Discount:</td>
                        <td class="alignRight">{{ proformaDetail?.percentDiscount ?? 0 }} %</td>
                        <td></td>
                      </tr>
                      <tr class="css-bold">
                        <td class="css-td-right" colspan="5">Total:</td>
                        <td class="alignRight">{{proformaDetail ? this.mService.giveTotalPrice(proformaDetail).toLocaleString("tr-TR", {style: 'currency', currency: 'USD'}): ''}} $</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                  </div>
                }
                @else {
                  <app-proforma-content [fEditingProforma]="this.proformaDetailCopy" [fEditingMachineId]="this.contentEditingMachineId" [fEditingPartId]="this.contentEditingPartId" [fEditingServiceId]="this.contentEditingServiceId" (editContentCanceled)="this.cancelContentEdit($event)" (editContentSave)="this.editContentSave($event)" [fNewMachine]="this.contentNewMachine" [fNewPart]="contentNewPart" [fNewService]="contentNewService" />
                }
                <div class="row mb-3 css-nomar" style="margin-top:10px">
                  <label class="col-sm-3 col-form-label">Discount:</label>
                  <div class="col-sm-7">
                    @if (proformaDetail && (proformaDetail.percentDiscount || proformaDetail.percentDiscount === 0)) {
                      <input [disabled]="this.changeActive ? false : true" type="text" (change)="checkDiscount($event)" [(ngModel)]="proformaSetDiscount" [ngModelOptions]="{standalone: true}" name="" id="">
                    }
                  </div>
                </div>
                <div class="row mb-3">
                    <label class="col-sm-3 col-form-label">Notes:</label>
                    <div class="col-sm-9">
                @if (proformaDetail && proformaDetail.notes && proformaDetail.notes.length + (N1var ? 1 : 0) > 0) {
                    
                      @if (this.N1var) {
                        <div class="css-proforma-note">**N1: Will be programmed after purchase.</div>
                      }
                      @for (note of proformaDetail.notes; track note) {
                        <div class="css-note-main">
                          <div class="css-proforma-note">* {{note}}</div>
                          @if (changeActive) {
                          <img src="/images/delete.png" class="css-intable-img css-img-smll" title="Sil" (click)="deleteNote(note)" />
                          }
                        </div>
                      }
                      @if (changeActive) {
                        <div class="css-note-main"><input type="text" class="form-control" id="formNewNote" placeholder="" [(ngModel)]="proformaNewNoteText" [ngModelOptions]="{standalone: true}">
                        <button class="btn btn-info" (click)="addNote()">Add</button></div>
                      }
                    
                  
                }
                @else {
                  <div class="css-proforma-note" style="font-style: italic; font-size: smaller">henüz not yok</div>
                  @if (changeActive) {
                        <div class="css-note-main"><input type="text" class="form-control" id="formNewNote" placeholder="" [(ngModel)]="proformaNewNoteText" [ngModelOptions]="{standalone: true}">
                        <button class="btn btn-info" (click)="addNote()">Add</button></div>
                      }
                }
                </div>
                </div>
                <div class="row mb-3">
                <label class="col-sm-3 col-form-label"></label>
                <div class="col-sm-7">
                  @if (!changeActive && !this.proformaDetail?.deactive) {
                    <button type="button" class="btn btn-warning" (click)="makeChangeActive()">Change</button>
                  }
                  @else if (changeActive && !this.proformaDetail?.deactive) {
                    <button type="button" (click)="proformaSave()" class="btn btn-success">Save</button>
                    <button type="button" class="btn btn-danger" (click)="changeCancel()">Cancel</button>
                  }
                  @else if (!this.proformaDetail?.deactive) {
                    <button type="button" class="btn btn-success" (click)="newProforma()">Save</button>
                  }
                </div>
              </div>
                
              </form>
          </div>
        </section>
      }
    </div>
  `,
  styles: `
    .input-group {
      align-items:center;
    }
    .scl1 {
      transform: scale(0.7);
    }
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
    .css-img-smll {
      height: 20px;
    }
    .css-img-xsmll{
      height: 17px;
    }
    .css-note-main {
      display: flex;
    }
    .css-note-main > img {
      margin-left: 5px;
    }
    .css-note-main:hover {
      color: red;
    }
    .css-model {
    padding: 10px 20px;
    margin: 5px 5px;
    background-color: rgba(179, 174, 174, 0.3);
    cursor:pointer;
    border-radius: 18px;
    }
    .css-model:hover {
        background-color: rgba(201, 100, 100, 0.3);
    }

  `
})
export class ProformaComponent {

  detailId = -1;
  
  mStyle = 0;
  
  changeActive = false;

  newRecord = false;

  N1var = false;
  
  addableMachineModels = [];

  addableParts = [];
  
  addableServices = [];

  proformaContentEdit: boolean = false;

  fgShowDeleted = new FormGroup({
    fcShowDeleted: new FormControl(false)
  });

  fgProformaDetail = new FormGroup({}
  )

  showDeactives = false;

  mNow = new Date();

  mService: GodisService = inject(GodisService);

  proformaShortList = this.mService.getProformaShortList(this.showDeactives);
  
  proformaDetail: Proforma | undefined;

  proformaDetailCopy: Proforma | undefined;

  dateExpirePicker: Date = new Date();

  contentEditingMachineId: number | undefined;
  contentEditingPartId: number | undefined;
  contentEditingServiceId: number | undefined;

  contentNewMachine = false;
  contentNewPart = false;
  contentNewService = false;

  notesBeforeEditing: string[] = [];
  proformaNewNoteText: string = '';

  isNewProforma: boolean = false;

  customerFilterText: string = '';

  allCustomers: Customer[] | undefined;
  customersFiltered: Customer[] | undefined;

  proformaContactPerson: string | undefined;
  proformaSetDiscount: number | undefined;
  proformaSetDiscountOrig: number | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.detailId = Number(this.route.snapshot.params["id"]);
    
    if (this.detailId || this.detailId === 0) {
      this.proformaDetail = structuredClone(this.mService.getProformaDetails(this.detailId));
      if (this.proformaDetail) {
        if (this.proformaDetail.percentDiscount) this.proformaSetDiscount = this.proformaDetail.percentDiscount;
        else this.proformaSetDiscount = 0;
        this.proformaContactPerson = this.proformaDetail.contactPerson;
      }
      if (!this.proformaDetail) this.router.navigate(['/proforma']);
    }
    else if (this.route.snapshot.params["id"] === "new") {
      this.isNewProforma = true;
      this.allCustomers = this.mService.getAllCustomers();
      this.customersFiltered = structuredClone(this.allCustomers);
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

    if(terminDays && isNaN(terminDays)) return "*";

    switch (terminDays) {
      case undefined:
        return '-';
      case -1:
        this.N1var = true;
        return '**N1';
      case 0:
        return 'stock';
      default:
        return terminDays + ' days'
    }
  }

  toggleShowDeleted() {
    const show = this.fgShowDeleted.value.fcShowDeleted;
    
    this.proformaShortList = this.mService.getProformaShortList(show ?? false);
  }

  makeChangeActive() {
    this.changeActive = true;
    if(this.proformaDetail && this.proformaDetail.notes) {
      this.notesBeforeEditing = structuredClone(this.proformaDetail.notes);
    }

    if (this.proformaDetail) {
      this.proformaSetDiscountOrig = this.proformaDetail.percentDiscount;
    }
  }

  changeCancel() {
    if (this.detailId === -2) {
      this.router.navigate(['/proforma']);
      return;
    }
    this.cancelContentEdit(false);
    this.proformaContactPerson = this.proformaDetail?.contactPerson ?? '';
    this.proformaSetDiscount = this.proformaDetail?.percentDiscount ?? 0;
    this.changeActive = false;
    this.proformaDetail = this.mService.getProformaDetails(this.detailId);
    this.proformaContactPerson = this.proformaDetail?.contactPerson ?? '';
    this.proformaSetDiscount = this.proformaDetail?.percentDiscount ?? 0;
    this.proformaContentEdit = false;
    this.proformaNewNoteText = '';
    if (this.proformaDetail) {
      this.proformaDetail.notes = structuredClone(this.notesBeforeEditing);
      this.proformaDetail.percentDiscount = this.proformaSetDiscountOrig;
    }
  }

  newProforma() {}

  copyProformaDetail() {
    this.proformaDetailCopy = structuredClone(this.proformaDetail);
  }

  addMachine() {
    this.copyProformaDetail();
    this.proformaContentEdit = true;
    this.contentNewMachine = true;
  }
  deleteMachine(id: number) {
    if (this.proformaDetail) {
      this.proformaDetail.machines = this.proformaDetail?.machines?.filter(mm => mm.machine.id != id);
      this.copyProformaDetail();
    }
  }
  editMachine(id: number) {
    console.log("edit machine from proforma");
    this.proformaDetailCopy = structuredClone(this.proformaDetail);
    this.proformaContentEdit = true;
    this.contentEditingMachineId = id;
  }
  addPart() {
    this.proformaDetailCopy = structuredClone(this.proformaDetail);
    this.proformaContentEdit = true;
    this.contentNewPart = true;
  }
  deletePart(id: number) {
    console.log("delete part from proforma");
    if (this.proformaDetail) {
      this.proformaDetail.parts = this.proformaDetail.parts?.filter(mp => mp.part.id != id);
      this.copyProformaDetail();
    }
  }
  editPart(id: number) {
    console.log("edit part from proforma");
    this.proformaContentEdit = true;
    this.contentEditingPartId = id;
    this.proformaDetailCopy = structuredClone(this.proformaDetail);
  }
  addService() {
    this.proformaDetailCopy = structuredClone(this.proformaDetail);
    this.proformaContentEdit = true;
    this.contentNewService = true;
  }
  deleteService(id: number) {
    console.log("delete service from proforma");
    if (this.proformaDetail) {
      this.proformaDetail.services = this.proformaDetail.services?.filter(ms => ms.service.id != id);
      this.copyProformaDetail();
    }
  }
  editService(id: number) {
    console.log("edit service from proforma");
    this.proformaContentEdit = true;
    this.contentEditingServiceId = id;
    this.proformaDetailCopy = structuredClone(this.proformaDetail);
  }

  cancelContentEdit(mbool: boolean) {
    this.contentEditingMachineId = undefined;
    this.contentEditingPartId = undefined;
    this.contentEditingServiceId = undefined;
    this.contentNewMachine = false;
    this.contentNewPart = false;
    this.contentNewService = false;
    this.proformaContentEdit = false;
    if (this.proformaDetail) {
      this.proformaDetail.notes = this.notesBeforeEditing;
    }
  }
  editContentSave(mProforma: Proforma) {
    this.proformaDetail = mProforma;
    this.proformaDetailCopy = structuredClone(this.proformaDetail);
    this.cancelContentEdit(false);
  }
  addNote() {
    if (this.proformaDetail) {
      if(this.proformaDetail?.notes) {
        this.proformaDetail.notes.push(this.proformaNewNoteText);
      }
      else {
        this.proformaDetail.notes = [this.proformaNewNoteText];
      }
    }
    this.proformaNewNoteText = '';
  }
  deleteNote(note: string) {
    if (this.proformaDetail && this.proformaDetail.notes && this.proformaDetail.notes.length > 0) {
      this.proformaDetail.notes = this.proformaDetail.notes.filter(n => n != note);
    }
  }
  proformaSave() {
    if (this.proformaDetail) {
      this.proformaDetail.createdDate = new Date();
      this.proformaDetail.validUntil = this.dateExpirePicker;
      this.proformaDetail.contactPerson = this.proformaContactPerson;
      this.proformaDetail.percentDiscount = this.proformaSetDiscount;

      console.log(this.proformaContactPerson);

      // ADD N1 NOTE IF NOT EXIST
      if (this.N1var) {
        if (!this.proformaDetail.notes || this.proformaDetail.notes.length < 1) {
          this.proformaDetail.notes = ["*N1: Will be programmed after purchase."];
        }
        else {
          if (this.proformaDetail.notes?.includes("*N1: Will be programmed after purchase.")) {
            this.proformaDetail.notes.push("*N1: Will be programmed after purchase.");
          }
        }
      }

      if(this.mService.saveProforma(this.proformaDetail, this.proformaDetail.id === -2 ? undefined : this.proformaDetail.id) === 1) {
        this.router.navigate(['/proforma']);
      }
    }
  }
  filterCustomerChanging(event: Event) {
    if (this.customerFilterText && this.customerFilterText.length > 0) {
      this.customersFiltered = this.allCustomers?.filter(c => c.name.toLocaleLowerCase().includes(this.customerFilterText.toLocaleLowerCase()));
    }
    else this.customersFiltered = this.allCustomers;
  }
  newProformaCustomerPicked(mCstmr: Customer) {

    this.proformaDetail = {
      id: -2,
      customer: mCstmr,
      deadline: new Date(),
      validUntil: new Date(),
      createdBy: {id: 1, userName: "manager", email: "a", password:"b"},
      createdDate: new Date(),
      percentDiscount: 0,
      notes: [
        "All currencies are USD",
        "VATs not included",
        "Delivery: EXW",
        "Purchase will not be accepted without acceptance document."
      ]
    }
    this.proformaSetDiscount = 0;
    this.notesBeforeEditing = structuredClone(this.proformaDetail.notes) ?? [];
    this.detailId = -2;
    this.isNewProforma = false;
    this.changeActive = true;

    // may be given from setting itf
  }
  deactivateProforma(pId: number) {
    if (this.mService.deactivateProforma(pId) === 1) {
      this.proformaShortList = this.mService.getProformaShortList(this.showDeactives);
    }
  }
  alertPhase2() {
    alert("Phase 2.")
  }
  newTab(id: number) {
    window.open(`/proforma/document/${id}`, "_blank");
  }
  checkDiscount(event: Event) {
    if (!this.proformaDetail) return;

    if (event.target) {
      let mTarget = event.currentTarget as HTMLInputElement;
      if (!mTarget.value) this.proformaSetDiscount = 0
      if(isNaN(Number(mTarget.value))) {
        this.proformaSetDiscount = 0;
      }
      else this.proformaSetDiscount = Number(mTarget.value);
    }
    else this.proformaSetDiscount = 0;

    this.proformaDetail.percentDiscount = this.proformaSetDiscount;
  }

}
