import { Injectable, model, numberAttribute } from '@angular/core';
import { UserRoleType, UserRole, User, Customer, CustomerDelegate, Proforma } from './godid';
import { MachineModel, MachineModelPrice } from './godid';
import { Part, PartPrice } from './godid';
import { Service, ServicePrice } from './godid';
import { MapType } from '@angular/compiler';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GodisService {


  // >>> ======================================= MOCK DATABASE

  protected users: User[] = [
    { id: 0, userName: 'admin', password: 'admin', email: 'arge@goknur.eu' },
    { id: 1, userName: 'boss', password: 'boss', email: 'boss@goknur.eu' },
    { id: 2, userName: 'director', password: 'director', email: 'director@goknur.eu' },
    { id: 3, userName: 'manager', password: 'manager', email: 'manager@goknur.eu' },
  ];

  protected userRoleTypes: UserRoleType[] = [
    { id: 0, name: 'admin' },
    { id: 1, name: 'boss' },
    { id: 2, name: 'director'},
    { id: 3, name: 'manager'}
  ];

  protected userRoles: UserRole[] = [
    { 
      id: 0, 
      user: { id: 0, userName: 'admin', password: 'admin', email: 'arge@goknur.eu' }, 
      role: { id: 0, name: 'admin' }, 
      start: new Date("02.14.2025") 
    },
    { 
      id: 1, 
      user: { id: 1, userName: 'boss', password: 'boss', email: 'boss@goknur.eu' }, 
      role: { id: 1, name: 'boss' }, 
      start: new Date("02.14.2000") 
    },
    { 
      id: 2, 
      user:{ id: 2, userName: 'director', password: 'director', email: 'director@goknur.eu' }, 
      role: { id: 2, name: 'director'}, 
      start: new Date("02.14.2015") 
    },
    { 
      id: 3, 
      user:{ id: 3, userName: 'manager', password: 'manager', email: 'manager@goknur.eu' }, 
      role: { id: 3, name: 'manager'}, 
      start: new Date("02.14.2020") 
    },
  ];

  protected machineModels: MachineModel[] = [
    { id: 0, abbreviation: 'OTTM', name: 'Otomatik Taban Torna Makinesi' },
    { id: 1, abbreviation: 'OMKM', name: 'Otomatik Maça Kaynak Makinesi' },
    { id: 2, abbreviation: 'TSM', name: 'Talaş Sarma Makinesi' },
    { id: 3, abbreviation: 'PM', name: 'Perçin Makinesi' },
    { id: 4, abbreviation: 'YGO', name: 'Yıkama Giriş Otomasyonu' },
    { id: 5, abbreviation: 'OFMK', name: 'Otomatik Frezeli Maça Kaynak Makinesi', Deactive: true },
    { id: 6, abbreviation: 'TOPY', name: 'Teflon Otomatik Pul Yükleme Otomasyonu' },
  ];

  protected machineModelPrices: MachineModelPrice[] = [
    {
      id: 0,
      model: { id: 0, abbreviation: 'OTTM', name: 'Otomatik Taban Torna Makinesi' },
      price: 100500,
      validityDate: new Date("02.14.2025"),
    },
    {
      id: 1,
      model: { id: 1, abbreviation: 'OMKM', name: 'Otomatik Maça Kaynak Makinesi' },
      price: 92500,
      validityDate: new Date("02.14.2025"),
    },
    {
      id: 2,
      model: { id: 2, abbreviation: 'TSM', name: 'Talaş Sarma Makinesi' },
      price: 22500,
      validityDate: new Date("02.14.2025"),
    },
    {
      id: 3,
      model: { id: 3, abbreviation: 'PM', name: 'Perçin Makinesi' },
      price: 42500,
      validityDate: new Date("02.12.2025"),
      validityEndDate: new Date("02.24.2025")
    },
    {
      id: 4,
      model: { id: 4, abbreviation: 'YGO', name: 'Yıkama Giriş Otomasyonu' },
      price: 62500,
      validityDate: new Date("02.14.2025"),
    },
    {
      id: 5,
      model: { id: 5, abbreviation: 'OFMK', name: 'Otomatik Frezeli Maça Kaynak Makinesi' },
      price: 62500,
      validityDate: new Date("02.14.2025"),
    },
    {
      id: 6,
      model: { id: 6, abbreviation: 'TOPY', name: 'Teflon Otomatik Pul Yükleme Otomasyonu' },
      price: 72500,
      validityDate: new Date("10.02.2024"),
      validityEndDate: new Date("02.14.2025"),
    },
    {
      id: 7,
      model: { id: 6, abbreviation: 'TOPY', name: 'Teflon Otomatik Pul Yükleme Otomasyonu' },
      price: 72500,
      validityDate: new Date("02.14.2025"),
    },
    {
      id: 8,
      model: { id: 3, abbreviation: 'PM', name: 'Perçin Makinesi' },
      price: 40000,
      validityDate: new Date("02.24.2025"),
    },
  ];

  protected parts: Part[] = [
    { 
      id: 0, 
      name: 'Y60 Zincir dişlisi', 
      code: 'GYP-1000001', 
      inMachineModels: [{ id: 4, abbreviation: 'YGO', name: 'Yıkama Giriş Otomasyonu' }],
      unit: "adet"
    },
    { id: 1, 
      name: 'Servo flanşı 0,75kW', 
      code: 'GYP-1000002',
      inMachineModels: [{ id: 0, abbreviation: 'OTTM', name: 'Otomatik Taban Torna Makinesi' }],
      unit: "adet"
    },
    { id: 2, 
      name: 'Kaplin takımı D40', 
      code: 'GYP-1000003',
      inMachineModels: [{ id: 0, abbreviation: 'OTTM', name: 'Otomatik Taban Torna Makinesi' }],
      unit: "adet"
    },
    { id: 3, 
      name: 'D100 Vantuz', 
      code: 'GYP-1000004',
      inMachineModels: [{ id: 0, abbreviation: 'OTTM', name: 'Otomatik Taban Torna Makinesi' }],
      unit: "adet"
    },
    { id: 4, 
      name: 'Kaynak baskı takımı', 
      code: 'GYP-1000005',
      inMachineModels: [{ id: 1, abbreviation: 'OMKM', name: 'Otomatik Maça Kaynak Makinesi' }],
      unit: "adet"
    },
    { id: 5, 
      name: 'Pens tutucu tabanca', 
      code: 'GYP-1000006',
      inMachineModels: [{ id: 1, abbreviation: 'OMKM', name: 'Otomatik Maça Kaynak Makinesi' }],
      unit: "adet"
    }
  ];

  protected partPrices: PartPrice[] = [
    { 
      id: 0, 
      part: { 
        id: 0, 
        name: 'Y60 Zincir dişlisi', 
        code: 'GYP-1000001', 
        inMachineModels: [{ id: 4, abbreviation: 'YGO', name: 'Yıkama Giriş Otomasyonu' }]
      }, 
      price: 33, 
      validityDate: new Date("02.14.2025")
    },
    { 
      id: 1, 
      part: { id: 1, 
        name: 'Servo flanşı 0,75kW', 
        code: 'GYP-1000002',
        inMachineModels: [{ id: 0, abbreviation: 'OTTM', name: 'Otomatik Taban Torna Makinesi' }]
      }, 
      price: 66, 
      validityDate: new Date("02.14.2025")
    },
    { 
      id: 2, 
      part: { id: 2, 
        name: 'Kaplin takımı D40', 
        code: 'GYP-1000003',
        inMachineModels: [{ id: 0, abbreviation: 'OTTM', name: 'Otomatik Taban Torna Makinesi' }]
      }, 
      price: 44, 
      validityDate: new Date("02.14.2025")
    },
    { 
      id: 3, 
      part: { id: 3, 
        name: 'D100 Vantuz', 
        code: 'GYP-1000004',
        inMachineModels: [{ id: 0, abbreviation: 'OTTM', name: 'Otomatik Taban Torna Makinesi' }]
      }, 
      price: 33, 
      validityDate: new Date("02.14.2025")
    },
    { 
      id: 4, 
      part: { id: 4, 
        name: 'Kaynak baskı takımı', 
        code: 'GYP-1000005',
        inMachineModels: [{ id: 1, abbreviation: 'OMKM', name: 'Otomatik Maça Kaynak Makinesi' }]
      }, 
      price: 230, 
      validityDate: new Date("02.14.2025")
    },
    { 
      id: 5, 
      part: { id: 5, 
        name: 'Pens tutucu tabanca', 
        code: 'GYP-1000006',
        inMachineModels: [{ id: 1, abbreviation: 'OMKM', name: 'Otomatik Maça Kaynak Makinesi' }]
      }, 
      price: 640, 
      validityDate: new Date("02.14.2025")
    }
  ];

  protected services: Service[]= [
    { id: 0, name: 'Montaj (Saatlik)' },
    { id: 1, name: 'Montaj (Günlük)' },
    { id: 2, name: 'Bakım (Saatlik)' },
    { id: 3, name: 'Bakım (Günlük)' },
    { id: 4, name: 'Devreye Alma (Günlük)' }
  ];

  protected servicePrices: ServicePrice[] = [
    { 
      id: 0,
      service: { id: 0, name: 'Montaj (Saatlik)' }, 
      price: 100, 
      validityDate: new Date("02.14.2025") 
    },
    { 
      id: 1,
      service: { id: 1, name: 'Montaj (Günlük)' }, 
      price: 500, 
      validityDate: new Date("01.14.2024"), 
      validityEndDate: new Date("01.25.2025")
    },
    { 
      id: 2,
      service: { id: 2, name: 'Bakım (Saatlik)' }, 
      price: 200, 
      validityDate: new Date("02.14.2025") 
    },
    { 
      id: 3,
      service: { id: 3, name: 'Bakım (Günlük)' }, 
      price: 600, 
      validityDate: new Date("02.14.2025") 
    },
    { 
      id: 4,
      service: { id: 4, name: 'Devreye Alma (Günlük)' }, 
      price: 400, 
      validityDate: new Date("02.14.2025") 
    },
    { 
      id: 5,
      service: { id: 1, name: 'Montaj (Günlük)' }, 
      price: 550, 
      validityDate: new Date("01.25.2025") 
    },
  ];

  protected customers: Customer[] = [
    {
      id: 0,
      name: "Bonera Çelik",
      address: "OSB, Kahramanmaraş",
    }
  ];

  protected customerDelegates: CustomerDelegate[] = [
    {
      id: 0,
      customer: { id: 0, name: "Bonera Çelik", address: "OSB, Kahramanmaraş" },
      firstName: "Arif",
      lastName: "Delege",
      phone: "+905321000000",
      startDate: new Date("01.01.2025")
    }
  ];

  protected proformas: Proforma[] = [
    {
      id: 0,
      customer: { id: 0, name: "Bonera Çelik", address: "OSB, Kahramanmaraş"},
      machines: [{
        machine: { id: 3, abbreviation: 'PM', name: 'Perçin Makinesi' },
        unitPrice: 43000, 
        quantity: 2
      }],
      deadline: new Date("20.01.1970"),
      percentDiscount: 5,
      createdBy: { id: 3, userName: 'manager', password: 'manager', email: 'manager@goknur.eu' },
      createdDate: new Date("2025-02-23T03:24:00Z"),
      validUntil: new Date("23.02.2025 11:03:43")
    },
    {
      id: 1,
      customer: { id: 0, name: "Bonera Çelik", address: "OSB, Kahramanmaraş"},
      machines: [{
        machine: { id: 3, abbreviation: 'PM', name: 'Perçin Makinesi' },
        unitPrice: 23000, 
        quantity: 3,
        notes: ["kapasite: 1000 adet/saat", "vibrasyon: X marka"],
        terminDays: 60
      }],
      parts: [
        {
          part: { id: 5, 
            name: 'Pens tutucu tabanca', 
            code: 'GYP-1000006',
            inMachineModels: [{ id: 1, abbreviation: 'OMKM', name: 'Otomatik Maça Kaynak Makinesi' }],
            unit: "adet"
          },
          unitPrice: 600,
          quantity: 4,
          terminDays: 0,
        }
      ],
      services: [
        {
          service: { id: 1, name: 'Montaj (Günlük)' },
          unitPrice: 510,
          quantity: 2,
          notes: ["yol ve konaklama masrafları müşteriye ait"],
          terminDays: -1
        }
      ],
      deadline: new Date("20.01.1970"),
      percentDiscount: 5,
      createdBy: { id: 3, userName: 'manager', password: 'manager', email: 'manager@goknur.eu' },
      createdDate: new Date("2025-01-23T03:24:00Z"),
      validUntil: new Date("2025-01-27T03:24:00Z"),
      notes: [
        "Fiyatlarımıza T.C.M.B. Döviz kuru geçeridir.",
        "Fiyatlara K.D.V. dahil değildir",
        "Teslim yeri iş yerimizdir",
        "Onay (Fax/E-mail) alınmadan sipariş kabul edilmeyecektir.",
        "Yedek parça ve işçilik bedelleri peşin olarak alınacaktır."
      ]
    }
  ];

  // <<< ======================================= MOCK DATABASE

  getAllMachineModels(): MachineModel[] | undefined {
    return this.machineModels;
  }

  getMachineListShort(): {machineId: number, machineCode: string, machineName: string, price: number, active: boolean}[] | undefined {
    let mReturn: {machineId: number, machineCode: string, machineName: string, price: number, active: boolean}[] = [];

    for (var machineModel of this.machineModels) {
      const price = this.machineModelPrices.find(mp => mp.model.id === machineModel.id && mp.validityEndDate === undefined)?.price || undefined

      if (!price) {
        console.log(`Program error. Couldn't find price for machine: ${machineModel.name}`);
        return;
      }

      mReturn.push(
        {
        machineId: machineModel.id,
        machineCode: machineModel.abbreviation,
        machineName: machineModel.name,
        price: price,
        active: machineModel.Deactive ? false : true
      });
    }

    return mReturn;
    
  }

  toggleActivationMachine(id: number, active: boolean): number {
    const myModel: MachineModel|undefined = this.machineModels.find(p=> p.id === id);

    if (!myModel) {
      console.log(`Service error. Couldn't find machine. ${id}`);
      return 0;
    }

    if (active) myModel.Deactive = true;
    else myModel.Deactive = undefined;

    return 1;
  }

  getMachineDetail(mid: number): { id: number, code: string, name: string, price: number, active: boolean, pictureUrl?: string, power?: number, capacity?: string, explanation?: string, productionTime?: number } | undefined {

    const machineModel = this.machineModels.find(m=> m.id === mid);

    if (!machineModel) {
      console.log(`Service error. Couldn't find machine model. ${mid}`);
      return;
    }

    const mPrice = this.machineModelPrices.find(p=> p.model.id === mid && p.validityEndDate === undefined);

    if (!mPrice) {
      console.log(`Service error. Couldn't find price. Model: ${machineModel.name}`);
      return;
    }

    return {
      id: machineModel.id,
      code: machineModel.abbreviation,
      price: mPrice.price,
      name: machineModel.name,
      active: machineModel.Deactive ? false : true,
      pictureUrl: machineModel.pictureUrl,
      power: machineModel.ElectricalPower,
      capacity: machineModel.Capacity,
      explanation: machineModel.Explanation,
      productionTime: machineModel.ProductionTime,
    }
  }

  editMachineDetail(id: number, code: string, name: string, power: number, capacity:string, explanation: string, price: number, imageUrl: string, productionTime: number) {
    try {
      const machineModel = this.machineModels.find(m=> m.id === id);

      if (!machineModel) {
        console.log(`Service error. Couldn't find machine model. ${id}`);
        return;
      }

      const mPrice = this.machineModelPrices.find(p=> p.model.id === id && p.validityEndDate === undefined);

      if (!mPrice) {
        console.log(`Service error. Couldn't find price. Model: ${machineModel.name}`);
        return;
      }

      machineModel.abbreviation = code && code.length > 0 ? code : machineModel.abbreviation;
      machineModel.name = name && name.length > 0 ? name : machineModel.name;
      machineModel.ElectricalPower = power ? power : undefined;
      machineModel.pictureUrl = imageUrl ? imageUrl : undefined;
      machineModel.Capacity = capacity ? capacity : undefined;
      machineModel.Explanation = explanation && explanation.length > 0 ? explanation : undefined;
      machineModel.ProductionTime = productionTime ? productionTime : undefined;

      if (price && price != mPrice.price) {
        let newID = this.machineModelPrices[this.machineModelPrices.length - 1].id + 1
        mPrice.validityEndDate = new Date();
        this.machineModelPrices.push({
          id: newID,
          model: machineModel,
          price: price,
          validityDate: new Date()
        });
      }

      return 1;
      
    } catch (err) {
      console.log("program error while editin.", err);
      return;
    }
  }
  newMachineDetail(code: string, name: string, power: number, capacity:string, explanation: string, price: number, imageUrl: string, productionTime: number) {
    try {

      if (code.length < 2 || name.length < 2 || !price) {
        console.log(`Service error. Couldn't save new model.`);
        return;
      }

      // find new ID for model and price
      const newModelId = this.machineModels[this.machineModels.length-1].id + 1;
      const newPriceId = this.machineModelPrices[this.machineModelPrices.length-1].id + 1;

      const myNewModel: MachineModel = {
        id: newModelId,
        abbreviation: code,
        name: name,
        ElectricalPower: power ?? undefined,
        Capacity: capacity ?? undefined,
        pictureUrl: imageUrl ?? undefined,
        ProductionTime: productionTime ?? undefined,
        Explanation: explanation ?? undefined
      }

      this.machineModels.push(myNewModel);

      const newPrice: MachineModelPrice = {
        id: newPriceId,
        model: myNewModel,
        price: price,
        validityDate: new Date()
      }

      this.machineModelPrices.push(newPrice);

      return 1;
      
    } catch (err) {
      console.log("program error while new record.", err);
      return;
    }
  }

  giveNumberCommas(x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  getAllParts(): Part[] | undefined {
    return this.parts;
  }
  getPartShortList(): {partId: number, partCode: string, partName: string, price: number, active: boolean}[] | undefined {
    let mReturn: {partId: number, partCode: string, partName: string, price: number, active: boolean}[] = [];

    for (var mPart of this.parts) {
      const price = this.partPrices.find(pp => pp.part.id === mPart.id && pp.validityEndDate === undefined)?.price;

      if (!price) {
        console.log(`Program error. Couldn't find price for machine: ${mPart.name}`);
        return;
      }

      mReturn.push({
        partId: mPart.id,
        partCode: mPart.code,
        partName: mPart.name,
        price: price,
        active: mPart.Deactive ? false : true
      });
    }

    return mReturn;
  }

  toggleActivationPart(id: number, active: boolean): number {
    try {
      const myPart = this.parts.find(p=> p.id === id);

      if (!myPart) {
        console.log("Service error while toggling part activation", "couldn't find part", id);
        return -1;
      }

      if(active) myPart.Deactive = true;
      else myPart.Deactive = undefined;

      return 1;

    } catch (err) {
      console.log("Service error while toggling part activation", err);
      return -1;
    }
  }

  getPartDetail(mid: number): {id: number, code: string, name: string, price: number, pictureUrl?: string, inMachines?: MachineModel[], active: boolean, unit?: string} | undefined {
    try {
      const mPart = this.parts.find(prt=> prt.id === mid);

      if (!mPart) {
        console.log("Service error while part reading.", "Couldn't found part:", mid);
        return;
      }

      const mPrice = this.partPrices.find(pp => pp.part.id === mid && pp.validityEndDate === undefined);

      if (!mPrice) {
        console.log("Service error while part reading.", "Couldn't found price:", mid);
        return;
      }

      return {
        id: mid,
        code: mPart.code,
        name: mPart.name,
        price: mPrice.price,
        pictureUrl: mPart.pictureUrl,
        inMachines: mPart.inMachineModels,
        active: mPart.Deactive ? false : true,
        unit: mPart.unit
      }
    } catch (err) {
      console.log("Service error while part detail reading.", err);
      return;
    }
  }

  editPart(id: number, code: string, name: string, price: number, inMachines?: MachineModel[], unit?: string, pictureUrl?: string): number {
    try {

      let myPart = this.parts.find(p => p.id === id);

      if (!myPart) {
        console.log("Service error while editing part. Couldn't found part ", id);
        return -1;
      }

      const myPrice = this.partPrices.find(pp=> pp.part.id === id && pp.validityEndDate === undefined);

      if (!myPrice) {
        console.log("Service error while editing part. Couldn't found price for part ", id)
      }

      if (code.length < 2 || name.length < 2 || !Number(price)) {
        console.log("Service error while editing Part. Requirments not fullfilled. ", id);
        return -1;
      }

      if (myPrice && myPrice.price != price) {
        myPrice.validityEndDate = new Date();
        const myNewPriceId = this.partPrices[this.partPrices.length - 1].id + 1;
        this.partPrices.push(
          {
            id: myNewPriceId,
            part: myPart,
            price: price,
            validityDate: new Date()
          }
        );
      }

      myPart.code = code;
      myPart.name = name;
      console.log("kayıt esnası", inMachines);
      myPart.inMachineModels = inMachines;
      myPart.unit = unit;
      myPart.pictureUrl = pictureUrl

      return 1;
    } catch (err) {
      console.log("Service error while editing part.", err);
      return -1;
    }
  }

  newPart(code: string, name: string, price: number, inMachines?: MachineModel[], unit?: string, pictureUrl?: string): number {
    try {

      if (code.length < 2 || name.length < 2 || !price) {
        console.log("Service error while new record. Requirements not fulfilled");
        return -1;
      }

      const newPartID = this.parts[this.parts.length - 1].id + 1;

      const newPart = {
        id: newPartID,
        code: code,
        name: name,
        pictureUrl: pictureUrl,
        unit: unit,
        inMachineModels: inMachines
      }

      this.parts.push(newPart);

      const newPriceId = this.partPrices[this.partPrices.length -1 ].id + 1;

      this.partPrices.push({
        id: newPriceId,
        price: price,
        validityDate: new Date(),
        part: newPart
      })

      return 1;
      
    } catch (err) {
      console.log("Service error while recording. ", err);
      return -1;
    }
  }

  getServiceList(): {id: number, name: string, price: number, active: boolean}[] {
    let myServiceList: {id: number, name: string, price: number, active: boolean}[] = [];

    for (var service of this.services) {
      const mPrice = this.servicePrices.find(p=> p.service.id === service.id && p.validityEndDate === undefined)?.price

      if (!mPrice) {
        console.log("Service error. Couldn't found price. ", service.name);
        return [];
      }

      myServiceList.push({
        id: service.id,
        name: service.name,
        price: mPrice,
        active: service.Deactive ? false : true,
      });
    }

    return myServiceList;
  }

  toggleActivationService(id: number, active: boolean): number {
    try {
      let myService = this.services.find(s=> s.id === id);

      if (!myService) {
        console.log("Service error while activation service. Couldn't found service", id);
        return -1;
      }

      if(active) myService.Deactive = true;
      else myService.Deactive = undefined;

      return 1;

    } catch (err) {
      console.log("Service error while activation service. ", id);
      return -1;
    }
  }

  editService(id: number, name: string, price: number): number {
    try {
      let myService = this.services.find(s => s.id === id);

      if (!myService) {
        console.log("Service error while service editing. Coulnd't found service. ", id);
        return -1;
      }

      if (!price) {
        console.log("Service error while service editing. Price unacceptable.", id);
        return -1;
      }

      const myPrice = this.servicePrices.find(sp => sp.service.id === id && sp.validityEndDate === undefined);

      if (!myPrice) {
        console.log("Service error while service editing. Coulnd't found price. ", id);
        return -1;
      }

      if (myPrice.price != price) {
        const newPriceId = this.servicePrices[this.servicePrices.length - 1].id + 1;

        myPrice.validityEndDate = new Date();

        this.servicePrices.push({
          id: newPriceId,
          price: price,
          service: myService,
          validityDate: new Date()
        });
      }

      myService.name = name;

      return 1;
    } catch (err) {
      console.log("Service error while service editing. ", id);
      return -1;
    }
  }

  newService(name: string, price: number): number {
    try {
      if (name.length < 2 || !price) {
        console.log("Service error while new service record. Requirements not fulfilling.");
      return -1;
      }

      const newServiceId = this.services[this.services.length - 1].id + 1;

      const newServicePriceId = this.servicePrices[this.servicePrices.length - 1].id + 1;

      const newService = {
        id: newServiceId,
        name: name
      }

      this.servicePrices.push({
        id: newServicePriceId,
        service: newService,
        price: price,
        validityDate: new Date()
      });

      this.services.push(newService);

      return 1;

    } catch (err) {
      console.log("Service error while new service record.", err);
      return -1;
    }
  }

  getCustomerShortList(): {id: number, name: string}[] {
    let myList = [];

    for (var customer of this.customers) {
      myList.push({
        id: customer.id,
        name: customer.name
      });
    }
    return myList;
  }

  getCustomerDetail(mid: number): {id: number, name: string, title?: string, address: string, delegates: CustomerDelegate[]} | undefined {
    try {
      const myCustomer = this.customers.find(c=> c.id === mid);

      if (!myCustomer) {
        console.log("Service error. Couldn't find customer. ", mid);
        return;
      }

      const customerDelegates: CustomerDelegate[] = this.customerDelegates.filter(cd=> cd.customer?.id === mid && cd.endDate === undefined);

      return {
        id: myCustomer.id,
        name: myCustomer.name,
        title: myCustomer.title,
        address: myCustomer.address,
        delegates: customerDelegates
      }
    } catch (err) {
      console.log("Service error while reading customer detail.");
      return;
    }
  }

  editCustomer(mid: number, name: string, title: string, address: string): number {
    try {
      let myCustomer = this.customers.find(c=> c.id === mid);

      if (!myCustomer) {
        console.log("Service error. Couldn't find customer.", mid);
        return 0;
      }

      if (name.length < 2 || address.length < 2) {
        console.log("Service error. Requirements not fulfilled.");
        return 0;
      }

      myCustomer. name = name,
      myCustomer.title = title,
      myCustomer.address = address

      return 1;
    } catch (err) {
      console.log("Service error while editing customer.", err);
      return 0;
    }
  }

  newCustomer(name: string, title: string, address: string): number {
    const newCustomerId = this.customers[this.customers.length - 1].id + 1;

    if ( !name || !address || name.length < 2 || address.length < 2) {
      console.log("Service error. Requirements not fulfilled.");
      return 0;
    }

    this.customers.push({
      id: newCustomerId,
      name: name,
      address: address,
      title: title
    });

    return 1;

  }

  giveTotalPrice(proforma: Proforma, discount?: boolean): number {
    let myTotalPrice = 0;

    if (discount === undefined) discount = false;

    if (proforma.machines) {
      for (var machineModel of proforma.machines) myTotalPrice += (machineModel.unitPrice * machineModel.quantity);
    }

    if (proforma.parts) {
      for (var part of proforma.parts) myTotalPrice += (part.unitPrice * part.quantity);
    }

    if (proforma.services) {
      for (var service of proforma.services) myTotalPrice += (service.unitPrice * service.quantity);
    }

    if (discount === true) return myTotalPrice;

    if (proforma.percentDiscount) myTotalPrice = myTotalPrice * (1 - (proforma.percentDiscount / 100));

    return myTotalPrice;
  }

  getProformaShortList(showDeactives?: boolean): {id: number, customerName: string, customerId: number, createdDate: Date, totalPrice: number, createdBy: User, detailsOpen: boolean, deactive: boolean}[] | undefined {
    // id, customer name, createdDate, total price

    try {
      let proformaShortList: {id: number, customerName: string, customerId: number, createdDate: Date, totalPrice: number, createdBy: User, detailsOpen: boolean, deactive: boolean}[] = [];

      for (var proforma of this.proformas.filter(pf => !pf.revisedById)) {

        if (!showDeactives && proforma.deactive) break;

        proformaShortList.push(
          {
            id: proforma.id,
            customerName: proforma.customer.name,
            customerId: proforma.customer.id,
            createdDate: proforma.createdDate,
            totalPrice: this.giveTotalPrice(proforma),
            createdBy: proforma.createdBy,
            detailsOpen: false,
            deactive: proforma.deactive ?? false
          }
        )
      }

      return proformaShortList;
    } catch (err) {
        console.log("Service error while proforma short list. ", err);
        return;
    }
  }

  getProformaDetails(mid: number): Proforma | undefined {
    try {
      const myProforma = this.proformas.find(p=> p.id === mid);

      if (!myProforma) {
        console.log("Service error while getting proforma details.", mid);
        return;
      }

      else {
        if (myProforma.machines) {
          for (var machine of myProforma.machines) {
  
            const myData = this.getProformaListPrice(0, machine.machine.id, myProforma.createdDate);
  
            machine.listPriceBefore = myData.before;
            machine.listPriceNow = myData.now;
          }
        }
        
        if (myProforma.parts) {
          for (var part of myProforma.parts) {
            const myData = this.getProformaListPrice(1, part.part.id, myProforma.createdDate);
            part.listPriceBefore = myData.before;
            part.listPriceNow = myData.now;
          }
        }

        if (myProforma.services) {
          for (var service of myProforma.services) {
            const myData = this.getProformaListPrice(2, service.service.id, myProforma.createdDate);
            service.listPriceBefore = myData.before;
            service.listPriceNow = myData.now
          }
        }

        return myProforma;
      }

    } catch (err) {
      console.log("Service error while getting proforma details.", err);
      return;
    }
  }

  getProformaListPrice(type: number, mId: number, mDate: Date): {before: number, now: number} {
    try {

      let myData = {before: -1, now: -1};
      const mNow = new Date();

      // for machines
      if (type === 0) {
        const myMachine = this.machineModels.find(mm => mm.id === mId);

        if (!myMachine) {
          console.log("Service error while taking list prices. Machine not found.", mId);
          return myData;
        }

        const myMachinePrices = this.machineModelPrices.filter( mp => mp.model.id === mId);

        if (!myMachinePrices) {
          console.log("Service error while taking list prices. Price not found.", mId);
          return myData;
        }

        const myCurrentPrice = myMachinePrices.find(mmp => !mmp.validityEndDate);

        if (myMachinePrices.length > 1) {
          let myPreviousPrice = myMachinePrices.find(mmp => mmp.validityEndDate && mmp.validityDate < mDate && mmp.validityEndDate >= mDate);

          if (!myPreviousPrice) myPreviousPrice = myCurrentPrice;

          myData.before = myPreviousPrice?.price ?? -1;
          myData.now = myCurrentPrice?.price ?? -1;

          return myData;

        }
        else {
          myData.before = myMachinePrices[0].price;
          myData.now = myCurrentPrice?.price ?? -1;
          return myData;
        }
      }

      else if (type === 1) {
        const myPart = this.parts.find(mp=> mp.id === mId);

        if (!myPart) {
          console.log("Service error while taking list prices. Part not found.", mId);
          return myData;
        }

        const myPartPrices = this.partPrices.filter(mp => mp.part.id === mId);

        if(!myPartPrices) {
          console.log("Service error while taking list prices. Price not found.", mId);
          return myData;
        }

        const myCurrentPrice = myPartPrices.find(mmp => !mmp.validityEndDate);

        if (myPartPrices.length > 1) {
          let myPreviousPrice = myPartPrices.find(mpp => mpp.validityEndDate && mpp.validityDate < mDate && mpp.validityEndDate >= mDate);

          if (!myPreviousPrice) myPreviousPrice = myCurrentPrice;

          myData.before = myPreviousPrice?.price ?? -1;
          myData.now = myCurrentPrice?.price ?? -1;

          return myData;
        }
        else {
          myData.before = myCurrentPrice?.price ?? -1;
          myData.now = myData.before;

          return myData;
        }
          
      }
      else if (type === 2) {
        const mService = this.services.find(s => s.id === mId);

        if (!mService) {
          console.log("Service error while taking list prices. Service not found.", mId);
          return myData;
        }

        const myServicePrices = this.servicePrices.filter(ms => ms.service.id === mId);

        if(!myServicePrices) {
          console.log("Service error while taking list prices. Price not found.", mId);
          return myData;
        }

        const myCurrentPrice = myServicePrices.find(msp => !msp.validityEndDate);

        if(myServicePrices.length > 1) {
          
          let myPreviousPrice = myServicePrices.find(msp => msp.validityEndDate && msp.validityDate < mDate && msp.validityEndDate >= mDate);

          if(!myPreviousPrice) myPreviousPrice = myCurrentPrice;

          myData.before = myPreviousPrice?.price ?? -1;
          myData.now =myCurrentPrice?.price ?? -1;

          return myData;
        }
        else {
          myData.before = myCurrentPrice?.price ?? -1;
          myData.now = myData.before;

          return myData;
        }
      }
      else return {before: -1, now:-1}
    } catch (err) {
      console.log("Service error while taking list prices.", err);
      return {before: -1, now: -1}
    }
  }

  getCustomerDetailComponent(mid: number): {id: number, name: string, proformaCount: number, purchaseCount: number, machineCount: number, detailsOpen: boolean} | undefined {
    try {
      const myCustomer = this.customers.find(c=> c.id === mid);

      if (!myCustomer) {
        console.log("Service error while getting customer detail.", mid);
        return;
      }

      let proformaCount = 0;
      let purchaseCount = 0;
      let machineCount = 0;

      proformaCount = this.proformas.filter(p=> p.customer.id === mid).length;
      
      // purchases and machines not set yet

      return {
        id: mid,
        name: myCustomer.name,
        proformaCount: proformaCount,
        purchaseCount: purchaseCount,
        machineCount: machineCount,
        detailsOpen: false
      }
    } catch (err) {
      console.log("Service error while getting customer detail.", err);
      return;
    }
  }

  formatDate(mDate: Date, format?: number): string {
    // format: 0 => 02 Feb
    if (!mDate) return "--error--";

    if (! format || format === 0) {

      return mDate.toLocaleDateString("tr-TR", {day: '2-digit', month: 'long', year: '2-digit'});

    }

    if (format === 1) {
      return mDate.toLocaleDateString("tr-TR", {day: '2-digit', month: 'short', year: 'numeric'});
    }

    return "--error--";

  }
  saveProforma(mProforma: Proforma, revisedProformaId: number | undefined): number {
    if(!revisedProformaId) {
      // new proforma
      return 0;
    }
    else {
      let newId = this.proformas[this.proformas.length - 1].id + 1;
      let revisingPforoma = this.proformas.find(pf => pf.id === mProforma.id)
      if (!revisingPforoma) {
        console.log("Service error. Couldn't found revising proforma");
        return 0;
      }

      if (revisingPforoma === mProforma) {
        console.log("Service error. No change in proforma revision");
        return 0;
      }

      let newProforma = mProforma;

      revisingPforoma.revisedById = newId;
      
      newProforma.id = newId;

      this.proformas.push(newProforma);
      return 1;
    }
  }

  constructor() { }
}
