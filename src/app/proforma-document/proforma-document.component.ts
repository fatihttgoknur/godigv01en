import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Proforma } from '../godid';
import { GodisService } from '../godis.service';

@Component({
  selector: 'app-proforma-document',
  imports: [],
  templateUrl: './proforma-document.component.html',
  styleUrl: './proforma-document.component.css'
})
export class ProformaDocumentComponent {

  detailId = -1;

  N1var: boolean = false;

  proformaDetail: Proforma | undefined;

  mService: GodisService = inject(GodisService);

  constructor(private route: ActivatedRoute, private router: Router) {

    this.detailId = Number(this.route.snapshot.params["id"]);
    console.log(this.route.snapshot.params["id"])

    if (this.detailId || this.detailId === 0) {
      this.proformaDetail = structuredClone(this.mService.getProformaDetails(this.detailId));

      if (!this.proformaDetail) {
        console.log("Program error. Proforma coulnd't found.", this.detailId);
        return;
      }

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
        return 'stok';
      default:
        return terminDays + ' gün'
    }
  }
}
