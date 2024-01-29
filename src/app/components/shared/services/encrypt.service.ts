import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  constructor() { }

  encryptWithAsciiSeed(value: string, seed: number, hash: number): string {
    let encryptedValue = '';
    
    // Agregar caracteres aleatorios basados en el valor de 'hash'
    for (let i = 0; i < hash; i++) {
      const randomChar = String.fromCharCode(
        Math.floor(Math.random() * 26) + 97 // Caracteres aleatorios entre 'a' y 'z'
      );
      value += randomChar;
    }
    
    for (let i = 0; i < value.length; i++) {
      const charCode = value.charCodeAt(i);
      const encryptedCharCode = charCode + seed;
      encryptedValue += String.fromCharCode(encryptedCharCode);
    }
    
    return encryptedValue;
  }


  decryptWithAsciiSeed(encryptedValue: string, seed: number, hash: number): string {
    // Primero, eliminamos los caracteres aleatorios agregados
    const originalLength = encryptedValue.length - hash;
    encryptedValue = encryptedValue.substring(0, originalLength);

    // Ahora, desencriptamos la cadena
    let decryptedValue = '';

    for (let i = 0; i < encryptedValue.length; i++) {
      const charCode = encryptedValue.charCodeAt(i);
      const decryptedCharCode = charCode - seed; // Restar la semilla
      decryptedValue += String.fromCharCode(decryptedCharCode);
    }

    return decryptedValue;
  }

}
