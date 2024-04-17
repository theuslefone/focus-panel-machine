import { Injectable } from '@angular/core';
import { ErrorMessages } from '../../models/type';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor() { }

  private errorMessages: { [key: string]: string } = {
    'saveDashboard': 'Erro ao salvar o dashboard. Tente novamente...',
    'loadCLPs': 'Erro ao carregar a lista de CLPs. Por favor, tente novamente...',
  };

  public getErrorMessage(key: string): string {
    return this.errorMessages[key] || '';
  }

}
