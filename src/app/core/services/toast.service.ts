import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: Toast[] = [];

  constructor() { }


  addToast(toast: Toast) {
    toast.id = crypto.randomUUID();
    this.toasts.push(toast);
    setTimeout(() => this.removeToastById(toast.id), 6000);
  }

  removeToast(toast: Toast) {
    let index = this.toasts.indexOf(toast);
    this.toasts.splice(index, 1);
  }

  removeToastById(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}


export interface Toast {
  id: string,
  message: string,
  type: ToastType,
  displayTime: number
}

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning"
}
