import { Injectable } from '@angular/core';
import * as jsonwebtoken from 'jsonwebtoken';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  // Función para decodificar un token JWT y obtener los datos del usuario
  decodeToken(token: string): any {
    try {
      const decoded = jsonwebtoken.decode(token);
      return decoded;
    } catch (error) {
      // console.error('Error al decodificar el token JWT:', error);
      return null;
    }
  }

  // Función para obtener el token de localStorage o de donde lo almacenes
  getToken(): string | null {
    const token = localStorage.getItem('jwtToken'); // Cambia esto si almacenas el token en otro lugar
    return token;
  }

  // Función para verificar si el token está presente y no ha expirado
  isTokenValid(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) {
      return false;
    }
    const currentTime = Date.now() / 1000; // Tiempo actual en segundos
    return decoded.exp && decoded.exp > currentTime;
  }


}
