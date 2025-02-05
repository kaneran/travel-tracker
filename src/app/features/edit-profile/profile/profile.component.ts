import { Component, inject } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  formBuilder: FormBuilder = inject(FormBuilder);
  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.formBuilder.group({
      quantity: this.formBuilder.control('', [Validators.required, Validators.min(1)]),
      type: this.formBuilder.control('', Validators.required),
      age: this.formBuilder.control('', [Validators.required, Validators.min(16)])
    }
    );
  }
}
