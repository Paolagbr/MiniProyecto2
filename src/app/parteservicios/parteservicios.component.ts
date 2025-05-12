import { Component } from '@angular/core';
import { ServicesService } from './services.service';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Informacion{
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  beneficio: string;
  duracion: string;
  expandido?: boolean;
}

@Component({
  selector: 'app-parteservicios',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, JsonPipe, CommonModule, FormsModule],
  templateUrl: './parteservicios.component.html',
  styleUrl: './parteservicios.component.css'
})
export class ParteserviciosComponent {
  inf: Informacion[]=[];
  cargando = true;
  error = null;
  expandido?: boolean;
  terminoBusqueda: string = '';
  serviciosFiltrados: Informacion[] = [];

  constructor(private tuApiService: ServicesService) {  }

  ngOnInit(): void {
    this.tuApiService.obtenerDatos().subscribe({
      next: (data) => {
        this.inf = data;
        this.serviciosFiltrados = data;
        this.cargando = false;
      },
      error: (error) => {
        this.error = error;
        this.cargando = false;

        console.error('Error al obtener datos: ', error);
      }
    });
  }
  trackById(index: number, item: Informacion): number{
    return item.id;
  }
  toggleDetalles(dato: any): void {
  dato.expandido = !dato.expandido;
  }

  filtrarServicios(): void {
  const termino = this.terminoBusqueda.toLowerCase();
  this.serviciosFiltrados = this.inf.filter(servicio =>
    servicio.name.toLowerCase().includes(termino) ||
    servicio.description.toLowerCase().includes(termino)
  );

}

}
