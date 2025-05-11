import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-cuestionario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './cuestionario.component.html',
  styleUrls: ['./cuestionario.component.css']
})
export class CuestionarioComponent implements OnInit {

  formulario: FormGroup;
  comentarios: any[] = [];
  modoEdicion: boolean = false;
  indiceEdicion: number | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]],
      servicio: ['', Validators.required],
      fechaCita: [null, Validators.required],
      feedback: this.fb.group({
        facilidadNavegar: [false],
        buenaPresentacion: [false],
        facilEntender: [false],
        estructuraUtilizada: [false]
      })
    });
  }

  ngOnInit() {
    const guardados = localStorage.getItem('comentariosUsuario');
    this.comentarios = guardados ? JSON.parse(guardados) : [];
  }

  enviarComentario() {
    if (this.formulario.valid) {
      const comentario = { ...this.formulario.value };

      if (this.modoEdicion && this.indiceEdicion !== null) {
        this.comentarios[this.indiceEdicion] = comentario;
        this.modoEdicion = false;
        this.indiceEdicion = null;
      } else {
        this.comentarios.push(comentario);
      }

      localStorage.setItem('comentariosUsuario', JSON.stringify(this.comentarios));
      this.formulario.reset();

      Swal.fire({
        title: "¡Guardado!",
        text: "Tu comentario ha sido registrado.",
        icon: "success"
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Completa todos los campos correctamente",
      });
    }
  }

  //editarComentario(index: number) {
  //  this.formulario.patchValue(this.comentarios[index]);
  //  this.modoEdicion = true;
  //  this.indiceEdicion = index;
  //}

  editarComentario(index: number) {
  const comentario = this.comentarios[index];

  // Asigna los valores simples
  this.formulario.patchValue({
    nombre: comentario.nombre,
    email: comentario.email,
    mensaje: comentario.mensaje,
    servicio: comentario.servicio,
    fechaCita: comentario.fechaCita
  });

  // Asigna el grupo feedback por separado
  this.formulario.get('feedback')?.patchValue({
    facilidadNavegar: comentario.feedback?.facilidadNavegar || false,
    buenaPresentacion: comentario.feedback?.buenaPresentacion || false,
    facilEntender: comentario.feedback?.facilEntender || false,
    estructuraUtilizada: comentario.feedback?.estructuraUtilizada || false
  });

  this.modoEdicion = true;
  this.indiceEdicion = index;
}


  eliminarComentario(index: number) {
    this.comentarios.splice(index, 1);
    localStorage.setItem('comentariosUsuario', JSON.stringify(this.comentarios));
    Swal.fire({
      icon: 'info',
      title: 'Comentario eliminado',
      text: 'Se ha eliminado correctamente.'
    });
  }

  myFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return day !== 0 && date >= today;
  };
}
