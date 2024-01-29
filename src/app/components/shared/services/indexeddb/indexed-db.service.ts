import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  constructor() { }

  crearIndexedDB(nombreDB: string, datosAGuardar: any[]) {

    const request = window.indexedDB.open(nombreDB, 1);

    request.onupgradeneeded = (event:any) => {
      const db = event.target.result;
      const store = db.createObjectStore('datos', { keyPath: 'ip' });
    };
    
    request.onsuccess = (event:any) => {
      const db = event.target.result;
      const transaction = db.transaction(['datos'], 'readwrite');
      const store = transaction.objectStore('datos');
      datosAGuardar.forEach((dato) => {
        const request = store.get(dato.ip);
        request.onsuccess = (event:any) => {
          const result = event.target.result;
          if (!result) {
            store.add(dato);
          }
          //////console.warn(8)
        }
      })

      transaction.oncomplete = () => {
        ////console.log('Datos guardados en IndexedDB.');
      };

      transaction.onerror = (event:any) => {
        console.error('Error al guardar datos en IndexedDB: ' + event.target.error);
      };
    };

    request.onerror = (event:any) => {
      console.error('Error al abrir la base de datos: ' + event.target.error);
    };
  }

  


}



