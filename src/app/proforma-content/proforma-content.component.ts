import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MachineModel, Part, Proforma, Service } from '../godid';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-proforma-content',
  imports: [ReactiveFormsModule],
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
  )

  constructor() {
    
  }
  ngOnInit() {

    if (this.fEditingMachineId) {
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
    else if (this.fEditingPartId) {
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
    else if (this.fEditingServiceId) {
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

}
