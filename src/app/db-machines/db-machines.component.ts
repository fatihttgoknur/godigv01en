import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { GodisService } from '../godis.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-db-machines',
  imports: [RouterModule, ReactiveFormsModule],
  template: `

    <div class="machines-main">
      @if (!this.detailId && this.detailId != 0) {
        <section class="css-section-navi">
          <a [routerLink]="['/database']">
            Database
          </a>
          <span>></span>
          <span>Machines</span>
        </section>
        <section class="css-table-manage">
          <div>
            <button type="button" class="btn btn-success" [routerLink]="['/db-machines/new']">+ Add New</button>
          </div>
        </section>
        <section class="table">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Code</th>
              <th scope="col">Name</th>
              <th scope="col">List Price</th>
              <th scope="col">Detail</th>
              <th scope="col">Active</th>
            </tr>
          </thead>
          <tbody>
            @for (machineModel of this.machineShortList; track machineModel) {
              <tr>
                <td>{{ machineModel.machineId + 1 }}</td>
                <td>{{ machineModel.machineCode }}</td>
                <td>{{ machineModel.machineName }}</td>
                <td class="alignRight">
                  <span>
                    {{ this.mService.giveNumberCommas(machineModel.price) }}
                  </span>
                </td>
                <td>
                  <img src="/images/details.png" class="css-intable-img" [routerLink]="['/db-machines', machineModel.machineId]" />
                </td>
                <td>
                @if (machineModel.active) {
                  
                  <img src="/images/deactivate-1.png" class="css-intable-img" (click)="toggleActivationMachine(machineModel.machineId, machineModel.active)" />
                }
                @else {
                    <img src="/images/activate-1.png" class="css-intable-img" (click)="toggleActivationMachine(machineModel.machineId, machineModel.active)" />
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
            Database
          </a>
          <span>></span>
          <a [routerLink]="['/db-machines']">
            Machines
          </a>
          <span>></span>
          <span>{{ this.newRecord ? "Yeni kayıt" : this.qMachineDetail?.name }}</span>
        </section>
        <section>
          <h2>{{ this.qMachineDetail?.name }}</h2>
          <div class="css-div-form">
            <form [formGroup]="fgEditMachineModel" (submit)="editMachineModel()">
              <div class="row mb-3">
                <label for="formCode" class="col-sm-3 col-form-label">Code:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formCode" placeholder="" value="{{this.qMachineDetail?.code}}" formControlName="code" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formName" class="col-sm-3 col-form-label">Name:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formName" placeholder="" value="{{this.qMachineDetail?.name}}" formControlName="name" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formPower" class="col-sm-3 col-form-label">Power (kW):</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formPower" placeholder="" value="{{this.qMachineDetail?.power}}" formControlName="power" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formCapacity" class="col-sm-3 col-form-label">Capacity:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formCapacity" placeholder="" value="{{this.qMachineDetail?.capacity}}" formControlName="capacity" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formExplanation" class="col-sm-3 col-form-label">Explanation:</label>
                <div class="col-sm-7">
                  <textarea style="resize: none; height:100px" name="formExplanation" id="formExplanation" class="form-control" value="{{this.qMachineDetail?.explanation}}" formControlName="explanation" [readOnly]="!changeActive"></textarea>
                </div>
              </div>
              <div class="row mb-3">
                <label for="formPrice" class="col-sm-3 col-form-label">Price:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formPrice" placeholder="" value="{{this.qMachineDetail?.price}}" formControlName="price" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formImageUrl" class="col-sm-3 col-form-label">Image:</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formImageUrl" placeholder="" value="{{this.qMachineDetail?.pictureUrl}}" formControlName="imageUrl" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label for="formProductionTime" class="col-sm-3 col-form-label">Production Time (days):</label>
                <div class="col-sm-7">
                  <input type="text" class="form-control" id="formProductionTime" placeholder="" value="{{this.qMachineDetail?.productionTime}}" formControlName="productionTime" [readOnly]="!changeActive">
                </div>
              </div>
              <div class="row mb-3">
                <label class="col-sm-3 col-form-label"></label>
                <div class="col-sm-7">
                  @if (!changeActive) {
                    <button type="button" class="btn btn-warning" (click)="makeChangeActive()">Change</button>
                  }
                  @else if (!this.newRecord) {
                    <button type="submit" class="btn btn-success">Save</button>
                    <button type="button" class="btn btn-danger" (click)="changeCancel()">Cancel</button>
                  }
                  @else {
                    <button type="button" class="btn btn-success" (click)="newMachineModel()">Save</button>
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
    .machines-main {
      margin-top: 20px
    }
    .css-div-form {
      margin: 0 20px 0 20px;
    }
  `
})

export class DbMachinesComponent {

  detailId = -1;

  qMachineDetail: { id: number, code: string, name: string, price: number, active: boolean, pictureUrl?: string, power?: number, capacity?: string, explanation?: string, productionTime?: number } | undefined;

  qChange: number = -1;

  machineShortList: {machineId: number, machineCode: string, machineName: string, price: number, active: boolean}[] | undefined = [];

  mService: GodisService = inject(GodisService);

  changeActive = false;

  newRecord = false;

  fgEditMachineModel = new FormGroup({
    code: new FormControl(),
    name: new FormControl(),
    power: new FormControl(),
    capacity: new FormControl(),
    explanation: new FormControl(),
    price: new FormControl(),
    imageUrl: new FormControl(),
    productionTime: new FormControl(),
  });

  toggleActivationMachine(machineId: number, active: boolean) {
    if (this.mService.toggleActivationMachine(machineId, active)) {
      this.machineShortList = this.mService.getMachineListShort();
    }
  }
  constructor(private route: ActivatedRoute, private router: Router) {
    this.machineShortList = this.mService.getMachineListShort();
    const idQuery = this.route.snapshot.params["id"];
    if (idQuery === "new") {
      console.log("new machine? impressive!")
      this.newRecord = true;
      this.changeActive = true;
    }
    else {
      this.detailId = Number(this.route.snapshot.params["id"]);
      if (this.detailId || this.detailId === 0) {
        this.qMachineDetail = this.mService.getMachineDetail(this.detailId);
        this.fgEditMachineModel = new FormGroup({
          code: new FormControl(this.qMachineDetail?.code),
          name: new FormControl(this.qMachineDetail?.name),
          power: new FormControl(this.qMachineDetail?.power),
          capacity: new FormControl(this.qMachineDetail?.capacity),
          explanation: new FormControl(this.qMachineDetail?.explanation),
          price: new FormControl(this.qMachineDetail?.price),
          imageUrl: new FormControl(this.qMachineDetail?.pictureUrl),
          productionTime: new FormControl(this.qMachineDetail?.productionTime)
        });
    }
    }
  }

  changeCancel() {
    this.changeActive = false;
    this.fgEditMachineModel = new FormGroup({
      code: new FormControl(this.qMachineDetail?.code),
      name: new FormControl(this.qMachineDetail?.name),
      power: new FormControl(this.qMachineDetail?.power),
      capacity: new FormControl(this.qMachineDetail?.capacity),
      explanation: new FormControl(this.qMachineDetail?.explanation),
      price: new FormControl(this.qMachineDetail?.price),
      imageUrl: new FormControl(this.qMachineDetail?.pictureUrl),
      productionTime: new FormControl(this.qMachineDetail?.productionTime)
    });
  }
  makeChangeActive() {
    this.changeActive = true;
  }

  editMachineModel() {
    let result = this.mService.editMachineDetail(
      this.detailId,
      this.fgEditMachineModel.value.code ?? undefined,
      this.fgEditMachineModel.value.name ?? undefined,
      Number(this.fgEditMachineModel.value.power) ?? undefined,
      this.fgEditMachineModel.value.capacity ?? undefined,
      this.fgEditMachineModel.value.explanation ?? undefined,
      Number(this.fgEditMachineModel.value.price) ?? undefined,
      this.fgEditMachineModel.value.imageUrl ?? undefined,
      Number(this.fgEditMachineModel.value.productionTime) ?? undefined
    );

    if (result) {
      this.machineShortList = this.mService.getMachineListShort();
      this.changeActive = false;
    }
    else {
      console.log("program error while editing");
    }
  }

  newMachineModel() {
    console.log(this.fgEditMachineModel.value.code);
    let result = this.mService.newMachineDetail(
      this.fgEditMachineModel.value.code ?? undefined,
      this.fgEditMachineModel.value.name ?? undefined,
      Number(this.fgEditMachineModel.value.power) ?? undefined,
      this.fgEditMachineModel.value.capacity ?? undefined,
      this.fgEditMachineModel.value.explanation ?? undefined,
      Number(this.fgEditMachineModel.value.price) ?? undefined,
      this.fgEditMachineModel.value.imageUrl ?? undefined,
      Number(this.fgEditMachineModel.value.productionTime) ?? undefined
    );

    if (result) {
      this.machineShortList = this.mService.getMachineListShort();
      this.changeActive = false;
      this.newRecord = false;
      this.router.navigate(['/db-machines']);
    }
    else {
      console.log("program error while new record");
    }
  }
}
