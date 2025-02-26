import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DatabaseComponent } from './database/database.component';
import { DbMachinesComponent } from './db-machines/db-machines.component';
import { DbPartsComponent } from './db-parts/db-parts.component';
import { DbServicesComponent } from './db-services/db-services.component';
import { DbCustomersComponent } from './db-customers/db-customers.component';
import { ProformaComponent } from './proforma/proforma.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        title: 'Göknur Digital - Home'
    },
    {
        path: 'database',
        component: DatabaseComponent,
        title: 'Göknur Digital - Veritabanı'
    },
    {
        path: 'db-machines',
        component: DbMachinesComponent,
        title: 'Göknur Digital - Makineler'
    },
    {
        path: 'db-machines/:id',
        component: DbMachinesComponent,
        title: 'Göknur Digital - Makine'
    },
    {
        path: 'db-parts',
        component: DbPartsComponent,
        title: 'Göknur Digital - Yedek parçalar'
    },
    {
        path: 'db-parts/:id',
        component: DbPartsComponent,
        title: 'Göknur Digital - Yedek Parça'
    },
    {
        path: 'db-services',
        component: DbServicesComponent,
        title: 'Göknur Digital - Hizmetler'
    },
    {
        path: 'db-services/:id',
        component: DbServicesComponent,
        title: 'Göknur Digital - Hizmet'
    },
    {
        path: 'db-customers',
        component: DbCustomersComponent,
        title: 'Göknur Digital - Müşteriler'
    },
    {
        path: 'db-customers/:id',
        component: DbCustomersComponent,
        title: 'Göknur Digital - Müşteri'
    },
    {
        path: 'proforma',
        component: ProformaComponent,
        title: 'Göknur Digital - Teklifler'
    },
    {
        path: 'proforma/:id',
        component: ProformaComponent,
        title: 'Göknur Digital - Teklif'
    }

];
