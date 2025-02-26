import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GodisService } from '../godis.service';
import { CustomerDelegate } from '../godid';

@Component({
  selector: 'app-db-customers',
  imports: [RouterModule, ReactiveFormsModule],
  template: `
    <div class="customers-main">
      @if (!this.detailId && this.detailId != 0) {
        <section class="css-section-navi">
          <a [routerLink]="['/database']">
            Veritabanı
          </a>
          <span>></span>
          <span>Müşteriler</span>
        </section>
        <section class="css-table-manage">
          <div>
            <button type="button" class="btn btn-success" [routerLink]="['/db-customers/new']">+ Yeni Ekle</button>
          </div>
        </section>
        <section class="table">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">İsim</th>
                <th scope="col">Detay</th>
              </tr>
            </thead>
            <tbody>
              @for (mCustomer of this.customerShortList; track mCustomer) {
                <tr>
                  <td>{{ mCustomer.id + 1 }}</td>
                  <td>{{ mCustomer.name }}</td>
                  <td>
                    <img src="/images/details.png" class="css-intable-img" [routerLink]="['/db-customers', mCustomer.id]" />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </section>
      }
      @else {
        <section class="css-section-navi">
          <a [routerLink]="['/database']">
            Veritabanı
          </a>
          <span>></span>
          <a [routerLink]="['/db-customers']">
            Müşteriler
          </a>
          <span>></span>
          <span>{{ this.newRecord ? "Yeni kayıt" : this.editingCustomer?.name }}</span>
        </section>
        <section>
          <h2>{{ this.editingCustomer?.name }}</h2>
          <div class="css-div-form">
            <form [formGroup]="fgCustomer" (submit)="editCustomer()">
              <div class="row mb-3">
                  <label for="formName" class="col-sm-3 col-form-label">Firma ismi:</label>
                  <div class="col-sm-7">
                    <input type="text" class="form-control" id="formName" placeholder="" value="{{this.editingCustomer?.name}}" formControlName="name" [readOnly]="!changeActive">
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="formTitle" class="col-sm-3 col-form-label">Ünvan:</label>
                  <div class="col-sm-7">
                    <input type="text" class="form-control" id="formTitle" placeholder="" value="{{this.editingCustomer?.name}}" formControlName="title" [readOnly]="!changeActive">
                  </div>
                </div>
                <div class="row mb-3">
                  <label for="formAddress" class="col-sm-3 col-form-label">Adres:</label>
                  <div class="col-sm-7">
                    <textarea style="resize: none; height: 100px" class="form-control" id="formAddress" placeholder="" formControlName="address" [readOnly]="!changeActive">
                      {{this.editingCustomer?.name}}
                    </textarea>
                  </div>
                </div>
                <div class="row mb-3">
                <label class="col-sm-3 col-form-label"></label>
                <div class="col-sm-7">
                  @if (!changeActive) {
                    <button type="button" class="btn btn-warning" (click)="makeChangeActive()">Değiştir</button>
                  }
                  @else if (!this.newRecord) {
                    <button type="submit" class="btn btn-success">Kaydet</button>
                    <button type="button" class="btn btn-danger" (click)="changeCancel()">İptal</button>
                  }
                  @else {
                    <button type="button" class="btn btn-success" (click)="newCustomer()">Kaydet</button>
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
    .customers-main {
      margin-top: 20px;
    }
  `
})
export class DbCustomersComponent {
  detailId = -1;
  
  changeActive = false;

  newRecord = false;

  customerShortList: {id: number, name: string}[] = [];

  editingCustomer: {id: number, name: string, title?: string, address: string, delegates: CustomerDelegate[]} | undefined;

  mService: GodisService = inject(GodisService);

  fgCustomer = new FormGroup({
    name: new FormControl(),
    title: new FormControl(),
    address: new FormControl()
  });

  constructor(private route: ActivatedRoute, private router: Router) {

    const idQuery = this.route.snapshot.params["id"];

    this.customerShortList = this.mService.getCustomerShortList();

    if (idQuery === "new") {
      this.newRecord = true;
      this.changeActive = true;
    }
    else {
      this.detailId = Number(this.route.snapshot.params["id"]);
      if (this.detailId || this.detailId === 0) {
        this.editingCustomer = this.mService.getCustomerDetail(this.detailId);
        this.fgCustomer = new FormGroup({
          name: new FormControl(this.editingCustomer?.name),
          title: new FormControl(this.editingCustomer?.title),
          address: new FormControl(this.editingCustomer?.address)
        });
        console.log("Customer details: ", this.editingCustomer);
      }
    }
  }
  makeChangeActive() {
    this.changeActive = true;
  }
  changeCancel() {
    this.changeActive = false;
    this.fgCustomer = new FormGroup({
      name: new FormControl(this.editingCustomer?.name),
      title: new FormControl(this.editingCustomer?.title),
      address: new FormControl(this.editingCustomer?.address)
    });
  }
  editCustomer() {
    const result = this.mService.editCustomer(
      this.detailId, 
      this.fgCustomer.value.name ?? undefined,
      this.fgCustomer.value.title ?? undefined,
      this.fgCustomer.value.address ?? undefined
    )

    if (result != 1) {
      this.changeCancel();
    }
    else {
      console.log("customer edit finished successfully.");
      this.changeActive = false;
      this.editingCustomer = this.mService.getCustomerDetail(this.detailId);
    }
  }
  newCustomer() {
    const result = this.mService.newCustomer(
      this.fgCustomer.value.name,
      this.fgCustomer.value.title,
      this.fgCustomer.value.address
    );

    if (result) {
      this.customerShortList = this.mService.getCustomerShortList();
      this.changeActive = false;
      this.newRecord = false;
      this.router.navigate(['/db-customers']);
    }

    else {
      console.log("program error while saving new customer");
    }
  }
}
