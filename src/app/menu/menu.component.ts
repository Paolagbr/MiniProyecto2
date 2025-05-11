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
import Swal from 'sweetalert2';


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
  selectedOption: string = '1';
  options = [
    { value: '1', label: 'Agendar cita' },
    { value: '2', label: 'Otro formulario' }
  ];

  originalUserName: string | undefined;

  constructor(private usuariosService: UsuariosService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listaCitas = this.usuariosService.getuserINFO();

    const datosUsuarioParaEditar = localStorage.getItem('usuarioParaEditar');
    this.grupos = this.usuariosService.getlista();
    this.horas = HORA;

    if (datosUsuarioParaEditar) {
      this.userINFO = JSON.parse(datosUsuarioParaEditar);
      this.originalUserName = this.userINFO.name;
      this.selectedOption = '1';

      if (this.userINFO.fechaCita) {
        this.cargarHorasOcupadas(this.userINFO.fechaCita);
      } else {
        this.horasOcupadas = [];
      }

    } else {
      this.userINFO = this.usuariosService.nuevoUsuario();
      this.originalUserName = undefined;
      localStorage.removeItem('usuarioParaEditar');
    }

    this.cdr.detectChanges();
  }

  editarUsuario(usuario: userInfo) {
    localStorage.setItem('usuarioParaEditar', JSON.stringify(usuario));
    this.userINFO = { ...usuario };
    this.originalUserName = usuario.name;

    if (this.userINFO.fechaCita) {
      this.cargarHorasOcupadas(this.userINFO.fechaCita);
    } else {
      this.horasOcupadas = [];
    }

    this.selectedOption = '1';
    this.cdr.detectChanges();
  }

  // eliminarUsuario(usuario: userInfo) {
  //   const confirmar = confirm(`¿Estás seguro de eliminar a ${usuario.name}?`);
  //   if (confirmar) {
  //     this.usuariosService.eliminarUsuario(usuario);
  //     this.listaCitas = this.usuariosService.getuserINFO();
  //     this.cdr.detectChanges();

  //     if (this.originalUserName && this.originalUserName === usuario.name) {
  //       this.limpiarFormulario();
  //     }
  //   }
  // }
  eliminarUsuario(usuario: userInfo) {
    Swal.fire({
      title: `¿Estás seguro de eliminar a ${usuario.name}?`,
      text: "¡Esta acción no se puede deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuario(usuario);
        this.listaCitas = this.usuariosService.getuserINFO();
        this.cdr.detectChanges();

        if (this.originalUserName && this.originalUserName === usuario.name) {
          this.limpiarFormulario();
        }

        Swal.fire(
          '¡Eliminado!',
          `El usuario ${usuario.name} ha sido eliminado correctamente.`,
          'success'
        );
      }
    });
  }

  actualizarStorage() {
    this.usuariosService.actualizarUsuarios([this.userINFO]);
    this.listaCitas = this.usuariosService.getuserINFO();
    this.cdr.detectChanges();
  }

  actualizarUsuario(): void {
    const nameToFind = this.originalUserName;

    if (!nameToFind) {
      Swal.fire({
        title: 'Advertencia',
        text: 'No se seleccionó un usuario para editar. Por favor, seleccione uno de la tabla.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const success = this.usuariosService.updateUsuario(nameToFind, this.userINFO);

    if (success) {
      this.originalUserName = undefined;
      localStorage.removeItem('usuarioParaEditar');

      this.listaCitas = this.usuariosService.getuserINFO();

      Swal.fire({
        title: 'Cambios Guardados',
        text: 'La información del usuario se ha actualizado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });

      this.cdr.detectChanges();

    } else {
      console.error('Component: No se pudo actualizar. Usuario no encontrado en el servicio (nombre original:', nameToFind, ')');
      Swal.fire({
        title: 'Error',
        text: `No se pudo encontrar el usuario "${nameToFind}" para actualizar. Puede que haya sido eliminado.`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      this.originalUserName = undefined;
      localStorage.removeItem('usuarioParaEditar');
      this.cdr.detectChanges();
    }
  }

  cargarDatosGuardados(): void {
    const datosGuardados = localStorage.getItem('formularioUsuario');
    if (datosGuardados) {
      this.userINFO = JSON.parse(datosGuardados);
    } else {
      this.userINFO = this.usuariosService.nuevoUsuario();
    }
    this.cdr.detectChanges();
  }

  guardarFormulario(): void {
    localStorage.setItem('formularioUsuario', JSON.stringify(this.userINFO));
  }

  actualizarSexo(event: any): void {
    this.userINFO.sexo = event.value;
    this.guardarFormulario();
  }

  guardarFecha(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      const fecha = event.value;
      const fechaFormateada = fecha.toISOString().split('T')[0];
      this.userINFO.fechaCita = fechaFormateada;
      this.cargarHorasOcupadas(fechaFormateada);
    } else {
      this.userINFO.fechaCita = '';
      this.horasOcupadas = [];
    }
    this.guardarFormulario();
    this.cdr.detectChanges();
  }

  guardarHora(event: any): void {
    this.userINFO.hora = event.value;
    this.guardarFormulario();
  }

  guardarServicio(event: any): void {
    this.userINFO.grupo = event.value;
    this.guardarFormulario();
  }

  actualizarNombre(): void {
    this.guardarFormulario();
  }

  nuevoUsuario(): void {
    if (this.originalUserName) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Estás en modo edición. Guarda los cambios o cancela antes de agendar una nueva cita.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

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

    this.listaCitas = this.usuariosService.getuserINFO();
    this.cdr.detectChanges();

    Swal.fire({
      title: '¡Cita Agendada!',
      text: 'Tu cita ha sido agendada con éxito.',
      icon: 'success',
      confirmButtonText: 'Aceptar'
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

  cargarHorasOcupadas(fecha: string): void {
    const citas = JSON.parse(localStorage.getItem('citas') || '[]');
    this.horasOcupadas = citas
      .filter((cita: any) => cita.fecha === fecha)
      .map((cita: any) => cita.hora);
    this.cdr.detectChanges();
  }

  limpiarFormulario(): void {
    this.userINFO = this.usuariosService.nuevoUsuario();
    this.horasOcupadas = [];
    this.originalUserName = undefined;
    localStorage.removeItem('usuarioParaEditar');
    localStorage.removeItem('formularioUsuario');
    this.cdr.detectChanges();
  }

}

