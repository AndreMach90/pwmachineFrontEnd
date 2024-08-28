import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ControlinputsService {
  validateAndCleanInput(input: HTMLInputElement) {
    const inputValue = input.value;
    const cleanedValue = inputValue.replace(/[^a-zA-Z ]/g, '');
    if (inputValue !== cleanedValue) input.value = cleanedValue;
  }

  validateAndCleanNumberInput(input: HTMLInputElement) {
    const inputValue   = input.value;
    const cleanedValue = inputValue.replace(/[^0-9.]*/g, '');
    if (inputValue !== cleanedValue) input.value = cleanedValue;
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    };
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  resetFormGroup(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsUntouched({ onlySelf: true });
      control?.markAsPristine({ onlySelf: true });
    });
  }
}
