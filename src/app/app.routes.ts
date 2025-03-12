import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DatabaseComponent } from './database/database.component';
import { DbMachinesComponent } from './db-machines/db-machines.component';
import { DbPartsComponent } from './db-parts/db-parts.component';
import { DbServicesComponent } from './db-services/db-services.component';
import { DbCustomersComponent } from './db-customers/db-customers.component';
import { ProformaComponent } from './proforma/proforma.component';
import { ProformaDocumentComponent } from './proforma-document/proforma-document.component';
ProformaDocumentComponent

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Company Digital - Home'
    },
    {
        path: 'database',
        component: DatabaseComponent,
        title: 'Company Digital - Database'
    },
    {
        path: 'db-machines',
        component: DbMachinesComponent,
        title: 'Company Digital - Machines'
    },
    {
        path: 'db-machines/:id',
        component: DbMachinesComponent,
        title: 'Company Digital - Machine'
    },
    {
        path: 'db-parts',
        component: DbPartsComponent,
        title: 'Company Digital - Spare Parts'
    },
    {
        path: 'db-parts/:id',
        component: DbPartsComponent,
        title: 'Company Digital - Spare Part'
    },
    {
        path: 'db-services',
        component: DbServicesComponent,
        title: 'Company Digital - Services'
    },
    {
        path: 'db-services/:id',
        component: DbServicesComponent,
        title: 'Company Digital - Service'
    },
    {
        path: 'db-customers',
        component: DbCustomersComponent,
        title: 'Company Digital - Customers'
    },
    {
        path: 'db-customers/:id',
        component: DbCustomersComponent,
        title: 'Company Digital - Customer'
    },
    {
        path: 'proforma',
        component: ProformaComponent,
        title: 'Company Digital - Proformas'
    },
    {
        path: 'proforma/:id',
        component: ProformaComponent,
        title: 'Company Digital - Proforma'
    },
    {
        path: 'proforma/document/:id',
        component: ProformaDocumentComponent,
        title: 'Company Digital - Proforma'
    },
];
