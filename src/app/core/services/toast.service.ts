import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  constructor() { }


  addToast(toast: Toast) {
    this.toasts.push(toast);
    setTimeout(() => this.removeToast(toast), 6000);
  }

  removeToast(toast: Toast) {
    let index = this.toasts.indexOf(toast);
    this.toasts.splice(index, 1);
  }
}


export interface Toast {
  message: string,
  type: ToastType,
  displayTime: number
}

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning"
}
