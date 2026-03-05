import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = 'http://localhost:8080/api/patients';

  constructor(private http: HttpClient) {}

  getPatients(page: number = 0, size: number = 10) {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<any>(this.apiUrl, { params });
  }

  getPatientById(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPatient(patient: any) {
    return this.http.post<any>(this.apiUrl, patient);
  }

  updatePatient(id: number, patient: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, patient);
  }

  deletePatient(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}