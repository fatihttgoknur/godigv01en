import { Component, EventEmitter, inject, Input, Output, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { MachineModel, Part, Proforma, Service } from '../godid';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon'
import { GodisService } from '../godis.service';

@Component({
  selector: 'app-proforma-content',
  imports: [ReactiveFormsModule, MatIconModule, FormsModule],
  templateUrl: './proforma-content.component.html',
  styleUrl: './proforma-content.component.css'
})
export class ProformaContentComponent {

  @Input({required: false}) fNewMachine: boolean | undefined;
  @Input({required: false}) fNewPart: boolean | undefined;
  @Input({required: false}) fNewService: boolean | undefined;

  @Input({required: false}) fEditingProforma: Proforma | undefined;
  @Input({required: false}) fEditingMachineId: number | undefined;
  @Input({required: false}) fEditingPartId: number | undefined;
  @Input({required: false}) fEditingServiceId: number | undefined;
  
  @Output() editContentCanceled = new EventEmitter<boolean>();
  @Output() editContentSave = new EventEmitter<Proforma>();

  mService: GodisService = inject(GodisService);

  fEditingMachine: { machine: MachineModel, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number } | undefined;
  fEditingPart: { part: Part, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number} | undefined;
  fEditingService: {service: Service, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number} | undefined;

  fEditingContent: { machine: MachineModel, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number } |
  { part: Part, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number} |
  {service: Service, unitPrice: number, quantity: number, listPriceBefore?: number, listPriceNow?: number, notes?: string[], terminDays?: number} | undefined;

  fgEditingMachine = new FormGroup(
    {
      fcEditingMachinePrice: new FormControl(0),
      fcEditingMachineQty: new FormControl(0),
      fcEditingMachineTermin: new FormControl(''),
      fcEditingMachineNewNote: new FormControl('')
    }
  );

  fSelectableNewMachines: MachineModel[] | undefined;
  fSelectableNewMachinesFiltered: MachineModel[] | undefined;

  fSelectableNewParts: Part[] | undefined;
  fSelectableNewPartsFiltered: Part[] | undefined;
  fSelectableNewPartFilterMachines: MachineModel[] | undefined;

  fSelectableNewServices: Service[] | undefined;
  fSelectableNewServicesFiltered: Service[] | undefined;

  machineFilterText: string | undefined;
  partMachineFilterText: string | undefined;
  partNameFilterText: string | undefined;

  partFilterMachines: MachineModel[] | undefined;
  partFilterMachinesSelectedList: MachineModel[] | undefined;

  partMachineFiltering: boolean = false;
  partsFiltered: Part[] | undefined;

  fServices: Service[] | undefined;

  constructor(private elementRef: ElementRef<HTMLElement>) {
    
  }
  ngOnInit() {
    console.log(this.fNewMachine, this.fNewPart, this.fNewService)
    if (this.fEditingMachineId || this.fEditingMachineId === 0) {
      this.fEditingMachine = this.fEditingProforma?.machines?.find(pm => pm.machine.id === this.fEditingMachineId);
      this.fEditingContent = this.fEditingMachine;

      this.fgEditingMachine = new FormGroup(
        {
          fcEditingMachinePrice: new FormControl(this.fEditingMachine?.unitPrice ?? 0),
          fcEditingMachineQty: new FormControl(this.fEditingMachine?.quantity ?? 0),
          fcEditingMachineTermin: new FormControl(this.fEditingMachine?.terminDays?.toString() ?? ''),
          fcEditingMachineNewNote: new FormControl('')
        }
      )
    }
    else if (this.fEditingPartId || this.fEditingPartId === 0) {
      this.fEditingPart = this.fEditingProforma?.parts?.find(pp => pp.part.id === this.fEditingPartId);
      this.fEditingContent = this.fEditingPart;

      this.fgEditingMachine = new FormGroup(
        {
          fcEditingMachinePrice: new FormControl(this.fEditingPart?.unitPrice ?? 0),
          fcEditingMachineQty: new FormControl(this.fEditingPart?.quantity ?? 0),
          fcEditingMachineTermin: new FormControl(this.fEditingPart?.terminDays?.toString() ?? ''),
          fcEditingMachineNewNote: new FormControl('')
        }
      )
    }
    else if (this.fEditingServiceId || this.fEditingServiceId === 0) {
      this.fEditingService = this.fEditingProforma?.services?.find(ps => ps.service.id === this.fEditingServiceId);
      this.fEditingContent = this.fEditingService;

      if (this.fEditingService?.terminDays === undefined) {}
      this.fgEditingMachine = new FormGroup(
        {
          fcEditingMachinePrice: new FormControl(this.fEditingService?.unitPrice ?? 0),
          fcEditingMachineQty: new FormControl(this.fEditingService?.quantity ?? 0),
          fcEditingMachineTermin: new FormControl(this.fEditingService?.terminDays?.toString() ?? ''),
          fcEditingMachineNewNote: new FormControl('')
        }
      )
    }
    else if (this.fNewMachine) {
      const fAllMachines = this.mService.getAllMachineModels();
      let filteredMachines = fAllMachines;
      if (this.fEditingProforma?.machines) {
        for (var machine of this.fEditingProforma?.machines) {
          filteredMachines = filteredMachines?.filter(fm => fm.id != machine.machine.id);
        }
      }
      this.fSelectableNewMachines = filteredMachines;
      this.fSelectableNewMachinesFiltered = this.fSelectableNewMachines;
    }
    else if (this.fNewPart) {
      const fAllParts = this.mService.getAllParts();
      let filteredParts = fAllParts;
      if(this.fEditingProforma?.parts) {
        for (var myPart of this.fEditingProforma.parts) {
          filteredParts = filteredParts?.filter(fp => fp.id != myPart.part.id);
        }
      }
      this.fSelectableNewParts = filteredParts;
      this.fSelectableNewPartsFiltered = this.fSelectableNewParts;
      this.filterPart();
    }
    else if (this.fNewService) {
      this.fServices = this.mService.getServiceList();
    }
    
  }

  addNote() {
    if (this.fEditingMachine && this.fgEditingMachine.value.fcEditingMachineNewNote) {
      this.fEditingMachine.notes ? this.fEditingMachine.notes?.push(this.fgEditingMachine.value.fcEditingMachineNewNote) : this.fEditingMachine.notes =  [this.fgEditingMachine.value.fcEditingMachineNewNote];
      this.fgEditingMachine.controls['fcEditingMachineNewNote'].setValue('');
    }
    else if (this.fEditingPart && this.fgEditingMachine.value.fcEditingMachineNewNote) {
      this.fEditingPart.notes ? this.fEditingPart.notes?.push(this.fgEditingMachine.value.fcEditingMachineNewNote) : this.fEditingPart.notes = [this.fgEditingMachine.value.fcEditingMachineNewNote]
      this.fgEditingMachine.controls['fcEditingMachineNewNote'].setValue('');
    }
    else if(this.fEditingService && this.fgEditingMachine.value.fcEditingMachineNewNote) {
      this.fEditingService.notes ? this.fEditingService.notes.push(this.fgEditingMachine.value.fcEditingMachineNewNote) : this.fEditingService.notes = [this.fgEditingMachine.value.fcEditingMachineNewNote];

      this.fgEditingMachine.controls['fcEditingMachineNewNote'].setValue('');
    }
  }

  pickChanged() {
    //this.editedProforma.emit(this.pickedDate);
  }
  contentEditCancel () {
    this.fEditingMachine = undefined;
    this.fEditingPart = undefined;
    this.fEditingService = undefined;
    this.editContentCanceled.emit(true);
  }
  contentNewSave() {
    let newUnitPrice = Number(this.fgEditingMachine.value.fcEditingMachinePrice);
    if (!newUnitPrice || isNaN(newUnitPrice)) {
      console.log("Program error. Unit price coudn't defined");
      return;
    };

    let newQuantity = Number(this.fgEditingMachine.value.fcEditingMachineQty);
    if(!newQuantity || isNaN(newQuantity)) {
      console.log("Program error. Quantity coudn't defined while new machine adding");
      return;
    };

    let newTerminDays: number | undefined = Number(this.fgEditingMachine.value.fcEditingMachineTermin);
    
    if (this.fgEditingMachine.value.fcEditingMachineTermin === undefined) newTerminDays = undefined;
    else newTerminDays = Number(this.fgEditingMachine.value.fcEditingMachineTermin);
    
    // NEW MACHINE
    if (this.fNewMachine) {

      if (!this.fEditingMachine) {
        console.log("Program error while new machine setting.");
        return;
      }
      this.fEditingMachine.quantity = newQuantity;
      this.fEditingMachine.unitPrice = newUnitPrice;
      this.fEditingMachine.terminDays = newTerminDays;

      this.fEditingProforma?.machines?.push(this.fEditingMachine);
      
    }// NEW PART
    else if (this.fNewPart) {
      if(!this.fEditingPart) {
        console.log("Program error while new part setting");
        return;
      }

      this.fEditingPart.quantity = newQuantity;
      this.fEditingPart.unitPrice = newUnitPrice;
      this.fEditingPart.terminDays = newTerminDays;

      this.fEditingProforma?.parts?.push(this.fEditingPart);
    }
    else if (this.fNewService) {
      if(!this.fEditingService) {
        console.log("Program error while new service setting");
        return;
      }

      this.fEditingService.quantity = newQuantity;
      this.fEditingService.unitPrice = newUnitPrice;
      this.fEditingService.terminDays = newTerminDays;

      this.fEditingProforma?.services?.push(this.fEditingService);
    }

    this.editContentSave.emit(this.fEditingProforma);
    this.fEditingMachine = undefined;
    this.fEditingPart = undefined;
    this.fEditingService = undefined;
  }
  contentEditSave() {
    // EDIT MACHINES
    if (this.fEditingProforma && this.fEditingProforma.machines && this.fEditingMachine) {
      for (var mMachine of this.fEditingProforma?.machines) {
        if (mMachine.machine.id === this.fEditingMachine.machine.id) {
          let newUnitPrice = Number(this.fgEditingMachine.value.fcEditingMachinePrice);
          if (!newUnitPrice || isNaN(newUnitPrice)) newUnitPrice = mMachine.unitPrice;

          let newQuantity = Number(this.fgEditingMachine.value.fcEditingMachineQty);
          if(!newQuantity || isNaN(newQuantity)) newQuantity = mMachine.quantity;

          let newTerminDays: number | undefined = Number(this.fgEditingMachine.value.fcEditingMachineTermin);
          if((mMachine.terminDays && isNaN(newTerminDays))) newTerminDays = mMachine.terminDays;
          if (this.fgEditingMachine.value.fcEditingMachineTermin === undefined) newTerminDays = undefined;

          mMachine.unitPrice =  newUnitPrice;
          mMachine.quantity =  newQuantity;
          mMachine.terminDays = this.giveTerminDays();
        }
      }
    }
    // EDIT PARTS
    if (this.fEditingProforma && this.fEditingPart && this.fEditingProforma.parts) {
      for (var mPart of this.fEditingProforma.parts) {
        if(mPart.part.id === this.fEditingPart.part.id) {
          let newUnitPrice = Number(this.fgEditingMachine.value.fcEditingMachinePrice);
          if (!newUnitPrice || isNaN(newUnitPrice)) newUnitPrice = mPart.unitPrice;

          let newQuantity = Number(this.fgEditingMachine.value.fcEditingMachineQty);
          if(!newQuantity || isNaN(newQuantity)) newQuantity = mPart.quantity;

          let newTerminDays: number | undefined = Number(this.fgEditingMachine.value.fcEditingMachineTermin);
          if((mPart.terminDays && isNaN(newTerminDays))) newTerminDays = mPart.terminDays;
          if (this.fgEditingMachine.value.fcEditingMachineTermin === undefined) newTerminDays = undefined;

          mPart.unitPrice =  newUnitPrice;
          mPart.quantity =  newQuantity;
          mPart.terminDays = this.giveTerminDays();
        }
      }
    }
    // EDIT SERVICE
    if (this.fEditingProforma && this.fEditingService && this.fEditingProforma.services) {
      for (var mService of this.fEditingProforma.services) {
        let newUnitPrice = Number(this.fgEditingMachine.value.fcEditingMachinePrice);
          if (!newUnitPrice || isNaN(newUnitPrice)) newUnitPrice = mService.unitPrice;

          let newQuantity = Number(this.fgEditingMachine.value.fcEditingMachineQty);
          if(!newQuantity || isNaN(newQuantity)) newQuantity = mService.quantity;

          mService.unitPrice =  newUnitPrice;
          mService.quantity =  newQuantity;
          mService.terminDays = this.giveTerminDays();
      }
    }

    this.editContentSave.emit(this.fEditingProforma);
    this.fEditingMachine = undefined;
    this.fEditingPart = undefined;
    this.fEditingService = undefined;
    this.fNewMachine = false;
    this.fNewPart = false;
    this.fNewService = false;
  }
  giveTerminDays(): number | undefined {
    let newTerminDays;
    const myInput = this.fgEditingMachine.value.fcEditingMachineTermin;

    if (!myInput || myInput.length < 1 || isNaN(Number(myInput))) {
      newTerminDays = undefined;
    }
    else {
      newTerminDays = Number(myInput);
    }
    return newTerminDays;
  }
  deleteNote(note: string) {
    if (this.fEditingMachine) {
      this.fEditingMachine.notes = this.fEditingMachine.notes?.filter(mnote => mnote != note);
    }
    else if (this.fEditingPart) {
      this.fEditingPart.notes = this.fEditingPart.notes?.filter(mnote => mnote != note);
    }
    else if (this.fEditingService) {
      this.fEditingService.notes = this.fEditingService.notes?.filter(snote => snote != note);
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    console.log("changes detected")
  }
  filterInputChanging(event: Event) {
    let myText = this.machineFilterText;

    if (myText && myText.length > 1) {
      this.fSelectableNewMachinesFiltered = this.fSelectableNewMachines?.filter(mm => (mm.name.toLocaleLowerCase().includes(myText.toLocaleLowerCase()))  || (mm.abbreviation.toLocaleLowerCase().includes(myText.toLocaleLowerCase())));
    }
    else {
      this.fSelectableNewMachinesFiltered = this.fSelectableNewMachines;
    }
  }
  partFilterInputChanging(event: Event | undefined) {
    let myText = this.partMachineFilterText;
    if (myText && myText.length > 1) {
      this.partFilterMachines = this.mService.getAllMachineModels()?.filter(mm => (mm.name.toLocaleLowerCase().includes(myText.toLocaleLowerCase())) || (mm.abbreviation.toLocaleLowerCase().includes(myText.toLocaleLowerCase())));
    }
    else {
      this.partFilterMachines = this.mService.getAllMachineModels();
    }

    if (this.partFilterMachinesSelectedList) {
      for (var mMachine of this.partFilterMachinesSelectedList) {
        this.partFilterMachines = this.partFilterMachines?.filter(pfm => pfm.id != mMachine.id);
      }
    }
  }
  partFilterNameChanging(event: Event) {
    this.filterPart();
  }
  filterPart() {
    let allParts = this.mService.getAllParts();
    this.partsFiltered = [];

    // BY SELECTED MACHINES
    if (this.partFilterMachinesSelectedList && this.partFilterMachinesSelectedList.length > 0) {
      for (var mMachineModel of this.partFilterMachinesSelectedList) {
        let mFParts = allParts?.filter(p=> p.inMachineModels?.includes(mMachineModel));
        
        if (allParts) {
          for (var pPart of allParts) {
            if (pPart.inMachineModels) {
              for (var mModel of pPart.inMachineModels) {
                if (mModel.id === mMachineModel.id) {
                  if (!this.partsFiltered?.includes(pPart)) {
                    this.partsFiltered?.push(pPart);
                  }
                }
              }
            }
          }
        }
      }
    }
    else {
      this.partsFiltered = allParts;
    }

    // BY NAME
    if (this.partNameFilterText) {
      this.partsFiltered = this.partsFiltered?.filter(p => p.name.toLocaleLowerCase().includes(this.partNameFilterText ? this.partNameFilterText.toLocaleLowerCase() : ''))
    }
  }
  newMachineModelPicked(myModel: MachineModel) {
    const myLP = this.mService.getProformaListPrice(0,myModel.id, new Date());
    this.fEditingContent = {
      machine: myModel,
      unitPrice: 1,
      quantity: 1,
      listPriceBefore: myLP.before,
      listPriceNow: myLP.now,
    }
    this.fEditingMachine = this.fEditingContent;
  }
  newPartPicked(myPart: Part) {
    const myLP = this.mService.getProformaListPrice(1, myPart.id, new Date());
    this.fEditingPart = {
      part: myPart,
      unitPrice: 1,
      quantity: 1,
      listPriceBefore: myLP.before,
      listPriceNow: myLP.now
    }
    this.fEditingContent = this.fEditingPart;
  }
  partMachineFilterFocused() {
    this.partFilterInputChanging(undefined);
    this.partMachineFiltering = true;
  }
  partMachineFilterBlur() {
    setTimeout(() => {
      this.partMachineFiltering = false;
    }, 150);
  }
  newPartMachinePicked(mModel: MachineModel) {
    this.partFilterMachinesSelectedList ? this.partFilterMachinesSelectedList?.push(mModel) : this.partFilterMachinesSelectedList = [mModel];
    this.partMachineFilterText = "";
    this.partFilterInputChanging(undefined);
    this.filterPart();
    
  }
  partMachinePickedDelete(mModelId: number) {
    if (this.partFilterMachinesSelectedList) {
      this.partFilterMachinesSelectedList = this.partFilterMachinesSelectedList.filter(sm => sm.id != mModelId);
    }
    this.partMachineFilterText = "";
    this.partFilterInputChanging(undefined);
    this.filterPart();
  }
  newServicePicked(mService: Service) {
    const myLP = this.mService.getProformaListPrice(2, mService.id, new Date());
    this.fEditingService = {
      service: mService,
      unitPrice: 1,
      quantity: 1,
      listPriceBefore: myLP.before,
      listPriceNow: myLP.now
    }
    this.fEditingContent = this.fEditingService;
  }

}
