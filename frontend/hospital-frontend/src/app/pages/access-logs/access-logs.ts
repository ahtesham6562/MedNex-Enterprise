import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  constructor(private http: HttpClient) {}

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
}