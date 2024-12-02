import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';
  private registerApiUrl= 'http://localhost:3000/api/auth/register';
  httpClient = inject(HttpClient);

  login(email: string, password: string) : Promise<any> {
    console.log('Email: ' + email + ' - Contraseña: ' + password);
    let body = '{"email":"' + email + '", "password":"' + password + '"}';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
     });
    let options = { headers: headers };
    return lastValueFrom(this.httpClient.post<string>(this.apiUrl + "/login", body, options));
  }

  search(filtro1: string, filtro2: string) : Promise<any> {
    console.log('filtro1: ' + filtro1 + ' - filtro2: ' + filtro2);
    return lastValueFrom(this.httpClient.get<string>(`${this.apiUrl}/search?filtro1=${filtro1}&filtro2=${filtro2}`));
  }

  async getAllUser(){
    return firstValueFrom(this.httpClient.get<any>(this.apiUrl)).then(response => {return response})
  }

 async register(newUser:IUser): Promise<any>{

    return firstValueFrom( this.httpClient.post(this.registerApiUrl,newUser)).then(response => {return response});
  }

  constructor() { }
}
