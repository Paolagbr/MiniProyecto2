import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { hora, lista, sexo, userInfo } from '../datos';
import { UsuariosService } from '../servicios/usuarios.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, JsonPipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { HORA } from '../grupo';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatRadioModule, FormsModule, JsonPipe,
    MatFormFieldModule, MatInputModule,
    MatDatepickerModule, MatRadioModule, MatTimepickerModule,
    MatSelectModule, MatInputModule, MatOptionModule, CommonModule, MatCardModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  userINFO: userInfo = {
    name: '',
    grupo: 0,
    sexo: '',
    fechaCita: '',
    hora: ''
  };

  grupos!: lista[];
  genero!: sexo[];
  horas!: hora[];
  listaCitas: userInfo[] = [];

  horasOcupadas: string[] = []
   selectedOption: string = ''; 
   options = [
    { value: '1', label: 'Agendar cita' },
    { value: '2', label: 'Otro formulario' }
  ];
  constructor(private usuariosService: UsuariosService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    //cargamos la informacion 
    const datosUsuario = localStorage.getItem('usuarioParaEditar');
    this.listaCitas = this.usuariosService.getuserINFO();
    this.grupos = this.usuariosService.getlista();
    this.horas = HORA;
    //Informacion de los usuarios
    if (datosUsuario) {
      this.userINFO = JSON.parse(datosUsuario);
      localStorage.removeItem('usuarioParaEditar'); 
    } else {
      const usuarios = this.usuariosService.getuserINFO();
      this.userINFO = usuarios.length > 0 ? usuarios[0] : {
        name: '',
        grupo: 0,
        sexo: '',
        fechaCita: '',
        hora: ''
      };
    }
  }

  editarUsuario(usuario: userInfo) {
    localStorage.setItem('usuarioParaEditar', JSON.stringify(usuario));
    this.userINFO = { ...usuario };
   
  }

  eliminarUsuario(usuario: userInfo) {
    const confirmar = confirm(`¿Estás seguro de eliminar a ${usuario.name}?`);
    if (confirmar) {
      this.usuariosService.eliminarUsuario(usuario);
    }
  }

  actualizarStorage() {
    this.usuariosService.actualizarUsuarios([this.userINFO]); 
  }
  actualizarUsuario() {
    const usuarios: userInfo[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex(u => u.name === this.userINFO.name);
    if (index !== -1) {
      usuarios[index] = this.userINFO;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      localStorage.removeItem('usuarioParaEditar');
      this.router.navigate(['/ruta-de-la-tabla']);
    }
  }
  /* */
  cargarDatosGuardados(): void {
    const datosGuardados = localStorage.getItem('formularioUsuario');
    if (datosGuardados) {
      this.userINFO = JSON.parse(datosGuardados);
    } else {
      this.userINFO = this.usuariosService.nuevoUsuario();
    }
  }

  guardarFormulario(): void {
    localStorage.setItem('formularioUsuario', JSON.stringify(this.userINFO));
  }

  actualizarSexo(event: any): void {
    this.guardarFormulario();
  }

  //Fecha seleccionada por el usuario
  guardarFecha(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const fecha = event.value;
      const fechaFormateada = fecha.toISOString().split('T')[0]; // Solo el YYYY-MM-DD
      this.userINFO.fechaCita = fechaFormateada;
      this.cargarHorasOcupadas(fechaFormateada);
    } else {
      this.userINFO.fechaCita = '';
    }
    this.guardarFormulario();
  }
  //Hora seleccionada
  guardarHora(event: any): void {
    this.userINFO.hora = event.target.value;
    this.guardarFormulario();
  }
  //Tipo de Servicio que se almacena
  guardarServicio(event: any): void {
    this.userINFO.grupo = event.value;
    this.guardarFormulario();
  }

  //Nombre del usuario
  actualizarNombre(): void {
    this.guardarFormulario();
  }

  nuevoUsuario(): void {
    this.usuariosService.agregarUsuario(this.userINFO);
    const citas = JSON.parse(localStorage.getItem('citas') || '[]');
    citas.push({
      fecha: this.userINFO.fechaCita,
      hora: this.userINFO.hora
    });
    localStorage.setItem('citas', JSON.stringify(citas));

    localStorage.removeItem('formularioUsuario');
    this.userINFO = this.usuariosService.nuevoUsuario();
    this.horasOcupadas = [];

    // //Confirmacion de la cita
    // Swal.fire({
    //   title: '¡Reservación Exitosa!',
    //   text: 'Tu reserva ha sido realizada con éxito.',
    //   icon: 'success',
    //   confirmButtonText: 'Aceptar'
    // });
  }

  /*Validacion del calendario*/
  myFilter = (d: Date | null): boolean => {
    const date = d || new Date();
    const day = date.getDay();
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return day !== 0 && date >= today;
  };
  /*Validacion de horas*/
  cargarHorasOcupadas(fecha: string): void {
    const citas = JSON.parse(localStorage.getItem('citas') || '[]');
    this.horasOcupadas = citas
      .filter((cita: any) => cita.fecha === fecha)
      .map((cita: any) => cita.hora);
  }

}

