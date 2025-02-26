import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { GodisService } from '../godis.service';
import { MachineModel } from '../godid';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-db-parts',
  imports: [RouterModule, ReactiveFormsModule],
  template: `
    <div class="parts-main">
      @if (!this.detailId && this.detailId != 0) {
        <section class="css-section-navi">
          <a [routerLink]="['/database']">
            Veritabanı
          </a>
          <span>></span>
          <span>Yedek parçalar</span>
        </section>
        <section class="css-table-manage">
          <div>
            <button type="button" class="btn btn-success" [routerLink]="['/db-parts/new']">+ Yeni Ekle</button>
          </div>
        </section>
        <section class="table">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Kod</th>
                <th scope="col">İsim</th>
                <th scope="col">Liste Fiyatı</th>
                <th scope="col">Detay</th>
                <th scope="col">Aktif</th>
              </tr>
            </thead>
            <tbody>
              @for (mPart of this.partShortList; track mPart) {
                <tr>
                  <td>{{ mPart.partId + 1 }}</td>
                  <td>{{ mPart.partCode }}</td>
                  <td>{{ mPart.partName }}</td>
                  <td class="alignRight">
                    <span>
                      {{ this.mService.giveNumberCommas(mPart.price) }}
                    </span>
                  </td>
                  <td>
                    <img src="/images/details.png" class="css-intable-img" [routerLink]="['/db-parts', mPart.partId]" />
                  </td>
                  <td>
                  @if (mPart.active) {
                    
                    <img src="/images/deactivate-1.png" class="css-intable-img" (click)="toggleActivationPart(mPart.partId, mPart.active)" />
                  }
                  @else {
                      <img src="/images/activate-1.png" class="css-intable-img" (click)="toggleActivationPart(mPart.partId, mPart.active)" />
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
          <a [routerLink]="['/db-parts']">
            Yedek Parçalar
          </a>
          <span>></span>
          <span>{{ this.newRecord ? "Yeni kayıt" : qPartDetail?.name }}</span>
        </section>
        <section>
          <h2>{{ this.qPartDetail?.name }}</h2>
          <div class="css-div-form">
            <!--<form [formGroup]="fgEditMachineModel" (submit)="editMachineModel()">-->
              <form [formGroup]="fgEditPart" (submit)="saveEditing()">
              <div class="row mb-3">
                <label for="formCode" class="col-sm-3 col-form-label">Kod:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formCode" placeholder="" value="{{this.qPartDetail?.code}}" formControlName="code" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formName" class="col-sm-3 col-form-label">İsim:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formName" placeholder="" value="{{this.qPartDetail?.name}}" formControlName="name" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formInMachine" class="col-sm-3 col-form-label">Makineler:</label>
                <div class="col-sm-7 css-inElements">
                  @for (machine of this.newRecord ? this.newParInMachines : this.qPartDetail?.inMachines; track machine) {
                    <div class="css-inMachineMain">
                      <div class="css-inMachineName">{{machine.name}}</div>
                      @if(changeActive) {
                        <div class="css-inMachineNameDelete" (click)="deleteFromInMachines(machine)">x</div>
                      }
                    </div> 
                  }
                  @if (changeActive) {
                    <div class="css-machinesAdd">
                    
                      <div class="btn-group">
                        <button type="button" class="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Makineye ekle
                        </button>
                        <div class="dropdown-menu">
                          @for (addableMachine of this.addAbleMachineList; track addableMachine) {
                            <!--<div class="dropdown-divider"></div>-->
                            <a class="dropdown-item" style="cursor: pointer;" (click)="addToInMachines(addableMachine)">{{ addableMachine.name }}</a>
                          }
                        </div>
                      </div>

                    </div>
                  }
                </div>
              </div>
              <div class="row mb-3">
                <label for="formImageUrl" class="col-sm-3 col-form-label">Resim:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formImageUrl" placeholder="" value="{{this.qPartDetail?.pictureUrl}}" formControlName="imageUrl" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formPrice" class="col-sm-3 col-form-label">Fiyat:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formPrice" placeholder="" value="{{this.qPartDetail?.price}}" formControlName="price" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formUnit" class="col-sm-3 col-form-label">Birim:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formUnit" placeholder="" value="{{this.qPartDetail?.unit}}" formControlName="unit" [readOnly]="!changeActive">
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
                    <button type="button" class="btn btn-success" (click)="newPart()">Kaydet</button>
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
    .parts-main {
      margin-top: 20px;
    }
    .css-inElements {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .css-inMachineMain {
      display: flex;
      flex-direction: row;
      margin: 5px;
      position: relative;
    }
    .css-inMachineName {
      position: relative;
      z-index: 1002;
      background-color: gray;
      border-radius: 8px;
      padding: 5px 15px 5px 15px;
      width: 100%;
    }
    .css-inMachineName:hover {
      z-index: 1000;
    }
    .css-inMachineNameDelete {
      background-color: red;
      color: white;
      position: absolute;
      z-index: 1001;
      padding: 2px 5px;
      margin: 2px;
      top: 0px;
      right: 0px;
      border-radius:5px;
    }
    .css-inMachineNameDelete:hover {
      z-index: 1010; cursor: pointer;
    }
    .css-machinesAdd {
      width:100%;
      display: flex;
    }
  `
})
export class DbPartsComponent {

  detailId = -1;

  partShortList: {partId: number, partCode: string, partName: string, price: number, active: boolean}[] | undefined = [];

  mService: GodisService = inject(GodisService);

  changeActive = false;

  newRecord = false;

  qPartDetail: {id: number, code: string, name: string, price: number, pictureUrl?: string, inMachines?: MachineModel[], active: boolean, unit?: string} | undefined;

  addAbleMachineList: MachineModel[] | undefined;

  unchangedInMachines: MachineModel[] | undefined;

  newParInMachines: MachineModel[] = [];

  fgEditPart = new FormGroup({
    code: new FormControl(),
    name: new FormControl(),
    price: new FormControl(),
    imageUrl: new FormControl(),
    unit: new FormControl(),
  })

  toggleActivationPart(partId: number, active: boolean) {
    if (this.mService.toggleActivationPart(partId, active)) {
      this.partShortList = this.mService.getPartShortList();
    }
  }
  constructor(private route: ActivatedRoute, private router: Router) {
      this.partShortList = this.mService.getPartShortList();

      const idQuery = this.route.snapshot.params["id"];

      if (idQuery === "new") {
        console.log("new part? impressive!")
        this.newRecord = true;
        this.changeActive = true;
        this.fillAddableMachineList();
      }
      else {
        this.detailId = Number(this.route.snapshot.params["id"]);
        if (this.detailId || this.detailId === 0) {
          this.qPartDetail = this.mService.getPartDetail(this.detailId);
          this.fgEditPart = new FormGroup({
            code: new FormControl(this.qPartDetail?.code),
            name: new FormControl(this.qPartDetail?.name),
            price: new FormControl(this.qPartDetail?.price),
            imageUrl: new FormControl(this.qPartDetail?.pictureUrl),
            unit: new FormControl(this.qPartDetail?.unit)
          });
        }
      }
    }
  changeCancel() {
    this.changeActive = false;
    if (this.qPartDetail) {
      this.qPartDetail.inMachines = this.unchangedInMachines;
    }
    this.fgEditPart = new FormGroup({
      code: new FormControl(this.qPartDetail?.code),
      name: new FormControl(this.qPartDetail?.name),
      price: new FormControl(this.qPartDetail?.price),
      imageUrl: new FormControl(this.qPartDetail?.pictureUrl),
      unit: new FormControl(this.qPartDetail?.unit)
    });
  }
  makeChangeActive() {
    this.changeActive = true;
    if (this.qPartDetail) this.unchangedInMachines = this.qPartDetail.inMachines?.slice();
    this.fillAddableMachineList();
  }

  fillAddableMachineList() {
    const allModels = this.mService.getAllMachineModels();
    let unavailableModels = this.qPartDetail?.inMachines;

    if (this.newRecord) unavailableModels = this.newParInMachines

    let filteredModels: MachineModel[] | undefined = allModels;

    if (unavailableModels && filteredModels) {
      for (var vmodel of unavailableModels) {
        filteredModels = filteredModels.filter(model =>  model.id != vmodel.id);
      }
    }

    this.addAbleMachineList = filteredModels;
  }

  addToInMachines(machineModel: MachineModel) {

    if (this.newRecord) this.newParInMachines.push(machineModel);
    else this.qPartDetail?.inMachines?.push(machineModel);
    this.fillAddableMachineList();
  }

  deleteFromInMachines(machineModel: MachineModel) {
    if(!this.newRecord && this.qPartDetail && this.qPartDetail.inMachines) {
      this.qPartDetail.inMachines = this.qPartDetail.inMachines.filter(model => model.id != machineModel.id);
    }
    if (this.newRecord) {
      this.newParInMachines = this.newParInMachines?.filter(model => model.id != machineModel.id)
    }
    this.fillAddableMachineList();
  }

  saveEditing() {
    if (!this.qPartDetail) return;

    const result = this.mService.editPart (
      this.qPartDetail.id,
      this.fgEditPart.value.code,
      this.fgEditPart.value.name,
      Number(this.fgEditPart.value.price),
      this.qPartDetail?.inMachines,
      this.fgEditPart.value.unit,
      this.fgEditPart.value.imageUrl
    );

    if (result != 1) {
      this.changeCancel();
    }
    else {
      console.log("part edit finished successfully.");
      this.changeActive = false;
    }
  }

  newPart() {
    const result = this.mService.newPart(
      this.fgEditPart.value.code ?? undefined,
      this.fgEditPart.value.name ?? undefined,
      Number(this.fgEditPart.value.price),
      this.newParInMachines ?? undefined,
      this.fgEditPart.value.unit ?? undefined,
      this.fgEditPart.value.imageUrl ?? undefined
    );
    if (result != 1) {
      console.log("Program error while new part record", result);
    }
    else {
      this.partShortList = this.mService.getPartShortList();
      this.changeActive = false;
      this.newRecord = false;
      this.router.navigate(['/db-parts']);
    }
  }
}
