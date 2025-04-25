import { Routes } from '@angular/router';
import { TiendaComponent } from './tienda/tienda.component';
import { UnProductoComponent } from './un-producto/un-producto.component';
import { CarruselComponent } from './components/carrusel/carrusel.component';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: CarruselComponent },
    {path:'Tienda', component: TiendaComponent},
    {path:'Tienda/:id', component: UnProductoComponent},
];
