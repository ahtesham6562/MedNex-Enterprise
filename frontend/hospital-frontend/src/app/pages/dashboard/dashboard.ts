import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  username = '';
  role = '';
  tenant = '';

  menuItems: { label: string, route: string, icon: string, roles: string[] }[] = [
    { label: 'Dashboard', route: '/dashboard', icon: '🏠', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
    { label: 'Patients', route: '/patients', icon: '🧑‍⚕️', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    this.role = localStorage.getItem('role') || '';
    this.tenant = localStorage.getItem('tenant') || '';
  }

  // ✅ Role-based menu filter
  get filteredMenu() {
    return this.menuItems.filter(item => item.roles.includes(this.role));
  }

  logout() {
    this.authService.logout();
  }
}