import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ControlinputsService {

  constructor() { }

  validateAndCleanInput(input: HTMLInputElement) {
    const inputValue = input.value;
    const cleanedValue = inputValue.replace(/[^a-zA-Z ]/g, '');
    if (inputValue !== cleanedValue) {
      input.value = cleanedValue;
    }
  }

  validateAndCleanNumberInput(input: HTMLInputElement) {
    const inputValue   = input.value;
    const cleanedValue = inputValue.replace(/[^0-9.]*/g, '');
    if (inputValue !== cleanedValue) {
      input.value = cleanedValue;
    }
  }

  // validateAndCleanNumberInputData(input: any) {
  //   let a = input.toString()
  //   const cleanedValue = a.replace(/[^0-9.]*/g, '');
  //   if (a !== cleanedValue) {
  //     input.value = cleanedValue;
  //   }
  // }

  // validateAndCleanInputDataText(input:any) {
  //   let a = input.toString()
  //   const cleanedValue = a.replace(/[^a-zA-Z ]/g, '');
  //   if (a !== cleanedValue) {
  //     input.value = cleanedValue;
  //   }
  // }


}
