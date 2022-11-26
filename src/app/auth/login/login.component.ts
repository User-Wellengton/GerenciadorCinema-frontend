import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { AutenticarUsuarioViewModel } from '../view-models/autenticar-usuario.view-model';
import { TokenViewModel } from '../view-models/token.view-model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  public loginVM: AutenticarUsuarioViewModel;

  constructor(
    titulo: Title,
    private fb: FormBuilder,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private usuarioService: UsuarioService,
    private router: Router,
    private toaster: ToastrService
  ) {
    titulo.setTitle('Login - GerenciadorCinema');
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  get email() {
    return this.form.get('email');
  }

  get senha() {
    return this.form.get('senha');
  }

  public login() {
    if (this.form.invalid) {
      this.toaster.warning('Por favor, Preencher corretamente o formulário. ', 'Aviso')
      return;
    }

    this.loginVM = Object.assign({}, this.loginVM, this.form.value);

    this.authService.login(this.loginVM).subscribe({

      next: (loginRealizado) => this.processarSucesso(loginRealizado),


      error: (erro) => this.processarErro(erro)
    })
  }

  private processarSucesso(loginRealizado: TokenViewModel) {
    this.localStorageService.salvarDadosLocaisUsuario(loginRealizado);
    this.usuarioService.logarUsuario(loginRealizado.usuarioToken);
    this.router.navigate(['/dashboard']);
  }

  private processarErro(erro: any) {
    this.toaster.warning(erro, 'Login')
    console.log(erro);
  }
}
