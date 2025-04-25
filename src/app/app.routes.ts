import { Routes } from '@angular/router';
import { TiendaComponent } from './tienda/tienda.component';
import { UnProductoComponent } from './un-producto/un-producto.component';

export const routes: Routes = [
    {path:'Tienda', component: TiendaComponent},
    {path:'Tienda/:id', component: UnProductoComponent},
];
