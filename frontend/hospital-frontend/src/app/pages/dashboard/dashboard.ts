import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, registerables, Chart } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  username = '';
  role = '';
  tenant = '';

  stats = {
    totalPatients: 0,
    totalAppointments: 0,
    scheduledAppointments: 0,
    cancelledAppointments: 0
  };

  menuItems: { label: string, route: string, icon: string, roles: string[] }[] = [
    { label: 'Home', route: '/welcome', icon: '🏠', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
    { label: 'Dashboard', route: '/dashboard', icon: '📊', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
    { label: 'Patients', route: '/patients', icon: '🧑‍⚕️', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
    { label: 'Appointments', route: '/appointments', icon: '📅', roles: ['ADMIN', 'DOCTOR', 'NURSE'] },
    { label: 'Access Logs', route: '/access-logs', icon: '🔒', roles: ['ADMIN'] },
  ];

  chartData: ChartData<'doughnut'> = {
    labels: ['Scheduled', 'Cancelled'],
    datasets: [{ data: [0, 0], backgroundColor: ['#1E6FCC', '#E63A2E'] }]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } }
  };

  barData: ChartData<'bar'> = {
    labels: ['Patients', 'Appointments'],
    datasets: [{ label: 'Total Count', data: [0, 0], backgroundColor: ['#1E6FCC', '#1E6FCC'] }]
  };

  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } }
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    this.role = localStorage.getItem('role') || '';
    this.tenant = localStorage.getItem('tenant') || '';
    this.loadStats();
  }

  loadStats() {
    this.http.get<any>('/api/dashboard/stats').subscribe({
      next: (data) => {
        this.stats = data;
        this.chartData = {
          ...this.chartData,
          datasets: [{ data: [data.scheduledAppointments, data.cancelledAppointments], backgroundColor: ['#1E6FCC', '#E63A2E'] }]
        };
        this.barData = {
          ...this.barData,
          datasets: [{ label: 'Total Count', data: [data.totalPatients, data.totalAppointments], backgroundColor: ['#1E6FCC', '#1E6FCC'] }]
        };
      },
      error: (err) => console.error(err)
    });
  }

  get filteredMenu() {
    return this.menuItems.filter(item => item.roles.includes(this.role));
  }

  logout() { this.authService.logout(); }
}