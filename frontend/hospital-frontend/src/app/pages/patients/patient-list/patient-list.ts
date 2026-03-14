import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PatientService } from '../../../core/services/patient';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css'
})
export class PatientList implements OnInit {
  patients: any[] = [];
  totalPages = 0;
  currentPage = 0;
  loading = false;
  role = '';

  constructor(
    private patientService: PatientService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.role = localStorage.getItem('role') || '';
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getPatients(this.currentPage).subscribe({
      next: (data) => {
        this.patients = data.content;
        this.totalPages = data.totalPages;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  exportPdf(id: number) {
    this.http.get(`/api/patients/${id}/export-pdf`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `patient-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('PDF export failed', err)
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPatients();
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPatients();
    }
  }

  deletePatient(id: number) {
    if (confirm('Are you sure you want to delete this patient?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => this.loadPatients()
      });
    }
  }

  isAdmin() { return this.role === 'ADMIN'; }
  isAdminOrDoctor() { return this.role === 'ADMIN' || this.role === 'DOCTOR'; }
}