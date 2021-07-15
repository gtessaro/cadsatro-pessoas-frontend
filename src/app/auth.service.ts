import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './login/usuario';

import { environment } from '../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl: string = environment.apiURLBase+"/api/usuarios";
  tokeURL: string = environment.apiURLBase+environment.obterTokenUrl;
  clientID: string = environment.clientId;
  clientSecret: string = environment.clienteSecret;
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private http: HttpClient
  ) { }

  obterToken(){
    const tokenString = localStorage.getItem('access_token')

    if(tokenString){
      const token = JSON.parse(tokenString).access_token;
      return token;
    }

    return null;
  }

  isAuthenticated(): boolean {
    const token = this.obterToken();
    if(token){
      const expirou = this.jwtHelper.isTokenExpired(token);
      return !expirou;
    }
    return false;
  }

  salvar(usuario: Usuario): Observable<any>{
    return this.http.post<any>(this.apiUrl,usuario);
  }

  tentarLogar(username: string, password: string): Observable<any>{
    const params = new HttpParams()
                                    .set('username', username)
                                    .set('password',password)
                                    .set('grant_type','password');

    const headers = {
      'Authorization': 'Basic '+btoa(`${this.clientID}:${this.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    return this.http.post(this.tokeURL, params.toString() , {headers});

  }

  encerrarSessao(){
    localStorage.removeItem('access_token');
  }

  getUsuarioAutenticado(){
    const token = this.obterToken();
    console.log(token);
    if(token){
      const usuario = this.jwtHelper.decodeToken(token).user_name;
      return usuario;
    }
    return null;
  }

}
