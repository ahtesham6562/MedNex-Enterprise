import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-access-logs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './access-logs.html',
  styleUrl: './access-logs.css'
})
export class AccessLogsComponent implements OnInit {

  logs: any[] = [];
  loading = false;
  error = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.error = '';
    this.http.get<any[]>('/api/access-logs').subscribe({
      next: (data) => {
        this.logs = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load. Please refresh.';
        console.error(err);
      }
    });
  }

  refresh() {
    this.loadLogs();
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }
}