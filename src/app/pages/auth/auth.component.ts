import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  phone = '';
  code = '';
  step = 1;

  constructor(private router: Router) { }

  sendCode() {
    if (this.phone.length > 5) {
      this.step = 2;
    }
  }

  verify() {
    if (this.code.length >= 4) {
      localStorage.setItem('user', this.phone);
      this.router.navigate(['/chat']);
    }
  }
}