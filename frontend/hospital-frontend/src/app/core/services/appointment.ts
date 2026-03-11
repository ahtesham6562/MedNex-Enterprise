import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Appointment {
  id?: number;
  doctorName: string;
  patientName: string;
  patientEmail: string;
  appointmentDateTime: string;
  status?: string;
  notes?: string;
  tenantId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl = '/api/appointments';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  create(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }

  updateStatus(id: number, status: string): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}/status?status=${status}`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}