import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable, map } from "rxjs";
import { UsuarioService } from "src/app/core/services/usuario.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.usuarioService.usuarioLogado.pipe(
      map(usuarioLogado => {
        if (usuarioLogado)
          return true;

        this.router.navigate(['/conta/autenticar']);
        return false;
      })
    )
  }
}
