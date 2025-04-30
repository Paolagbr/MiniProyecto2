import { Routes } from '@angular/router';
import { TiendaComponent } from './tienda/tienda.component';
import { UnProductoComponent } from './un-producto/un-producto.component';
import { CarruselComponent } from './components/carrusel/carrusel.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { FormularioReactivoComponent } from './components/formulario-reactivo/formulario-reactivo.component';

export const routes: Routes = [
    { path: '', redirectTo: '/inicio', pathMatch: 'full' },
    { path: 'inicio', component: CarruselComponent },
    {path:'Tienda', component: TiendaComponent},
    {path:'Tienda/:id', component: UnProductoComponent},
    {path: 'Nosotros', component: NosotrosComponent },
    {path: 'formulario-reactivo', component: FormularioReactivoComponent}
];
