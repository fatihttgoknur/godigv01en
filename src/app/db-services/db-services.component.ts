import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GodisService } from '../godis.service';

@Component({
  selector: 'app-db-services',
  imports: [RouterModule, ReactiveFormsModule],
  template: `
    <div class="services-main">
      @if (!this.detailId && this.detailId != 0) {
        <section class="css-section-navi">
          <a [routerLink]="['/database']">
            Veritabanı
          </a>
          <span>></span>
          <span>Hizmetler</span>
        </section>
        <section class="css-table-manage">
          <div>
            <button type="button" class="btn btn-success" [routerLink]="['/db-services/new']">+ Yeni Ekle</button>
          </div>
        </section>
        <section class="table">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">İsim</th>
                <th scope="col">Liste Fiyatı</th>
                <th scope="col">Değiştir</th>
                <th scope="col">Aktif</th>
              </tr>
            </thead>
            <tbody>
              @for (myService of this.serviceList; track myService) {
                <tr>
                  <td>{{ myService.id + 1 }}</td>
                  <td>{{ myService.name }}</td>
                  <td class="alignRight">
                    <span>
                      {{ this.mService.giveNumberCommas(myService.price) }}
                    </span>
                  </td>
                  <td>
                    <img src="/images/slider.png" class="css-intable-img" [routerLink]="['/db-services', myService.id]" />
                  </td>
                  <td>
                  @if (myService.active) {
                    
                    <img src="/images/deactivate-1.png" class="css-intable-img" (click)="toggleActivationPart(myService.id, myService.active)" />
                  }
                  @else {
                      <img src="/images/activate-1.png" class="css-intable-img" (click)="toggleActivationPart(myService.id, myService.active)" />
                  }
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
          <a [routerLink]="['/db-services']">
            Hizmetler
          </a>
          <span>></span>
          <span>{{ this.newRecord ? "Yeni kayıt" : this.editintService?.name }}</span>
        </section>
        <section>
          <h2>{{ this.editintService?.name }}</h2>
          <div class="css-div-form">
            <form [formGroup]="fgService" (submit)="saveEditing()">
              <div class="row mb-3">
                <label for="formName" class="col-sm-3 col-form-label">İsim:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formName" placeholder="" value="{{this.editintService?.name}}" formControlName="name" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formPrice" class="col-sm-3 col-form-label">Fiyat:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formPrice" placeholder="" value="{{this.editintService?.price}}" formControlName="price" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label class="col-sm-3 col-form-label"></label>
                <div class="col-sm-7">
                  @if (!changeActive) {
                    
                  }
                  @else if (!this.newRecord) {
                    <button type="submit" class="btn btn-success">Kaydet</button>
                    <button type="button" class="btn btn-danger" (click)="changeCancel()">İptal</button>
                  }
                  @else {
                    <button type="button" class="btn btn-success" (click)="newService()">Kaydet</button>
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
    .services-main {
        margin-top: 20px;
      }
  `
})
export class DbServicesComponent {
  detailId = -1;

  changeActive = false;

  newRecord = false;

  mService: GodisService = inject(GodisService);

  serviceList: {id: number, name: string, price: number, active: boolean}[] = [];

  editintService: {id: number, name: string, price: number, active: boolean} | undefined;

  fgService = new FormGroup({
    name: new FormControl(),
    price:new FormControl()
  })

  constructor(private route: ActivatedRoute, private router: Router) {
    const idQuery = this.route.snapshot.params["id"];

    this.serviceList = this.mService.getServiceList();

    if (idQuery === "new") {
      this.newRecord = true;
      this.changeActive = true;
    }
    else {
      this.detailId = Number(this.route.snapshot.params["id"]);

      if (this.detailId || this.detailId === 0) {

        this.editintService = this.serviceList.find(s=> s.id === this.detailId);

        this.fgService = new FormGroup({
          name: new FormControl(this.editintService?.name),
          price: new FormControl(this.editintService?.price)
        });

        this.changeActive = true;
      }
    }
  }

  toggleActivationPart(serviceId: number, active: boolean) {
    if (this.mService.toggleActivationService(serviceId, active)) {
      this.serviceList = this.mService.getServiceList();
    }
  }
  changeCancel() {
    this.router.navigate(['/db-services']);
  }
  saveEditing() {
    if (!Number(this.fgService.value.price) || this.fgService.value.name.length < 2 || !this.editintService) {
      console.log("Program error. Unacceptable inputs.");
      return;
    }

    const result = this.mService.editService(
      this.editintService.id ?? undefined,
      this.fgService.value.name ?? undefined,
      Number(this.fgService.value.price) ?? undefined
    );

    if (result) {
      this.router.navigate(['/db-services']);
    }
    else {
      console.log("Program error while editing service.")
      return;
    }


  }
  newService() {
    if (!Number(this.fgService.value.price) || this.fgService.value.name.length < 2) {
      console.log("Program error. Unacceptable inputs.");
      return;
    }

    const result = this.mService.newService(
      this.fgService.value.name,
      Number(this.fgService.value.price)
    );

    if (result) {
      this.router.navigate(['/db-services']);
    }
    else {
      console.log("Program error while new service record.")
      return;
    }
  }
}
