import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AppointmentService, Appointment } from '../../core/services/appointment';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FullCalendarModule, RouterLink],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class AppointmentsComponent implements OnInit {

  appointments: Appointment[] = [];
  appointmentForm: FormGroup;
  showForm = false;
  errorMessage = '';
  successMessage = '';

  isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  calendarOptions: CalendarOptions = {
    initialView: this.isMobile ? 'dayGridMonth' : 'timeGridWeek',
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    headerToolbar: this.isMobile ? {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth'
    } : {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
    height: this.isMobile ? 400 : 'auto',
    aspectRatio: this.isMobile ? 1.2 : 1.8,
  };

  constructor(
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.appointmentForm = this.fb.group({
      doctorName: ['', Validators.required],
      patientName: ['', Validators.required],
      patientEmail: ['', [Validators.required, Validators.email]],
      appointmentDateTime: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAll().subscribe({
      next: (data) => {
        this.appointments = data;
        this.calendarOptions = {
          ...this.calendarOptions,
          events: data.map(a => ({
            title: `Dr. ${a.doctorName} - ${a.patientName}`,
            start: a.appointmentDateTime + '+05:30',
            color: a.status === 'CANCELLED' ? '#E63A2E' : '#1E6FCC'
          }))
        };
      },
      error: (err) => console.error(err)
    });
  }

  onSubmit() {
    if (this.appointmentForm.invalid) return;
    this.errorMessage = '';
    this.successMessage = '';

    this.appointmentService.create(this.appointmentForm.value).subscribe({
      next: () => {
        this.successMessage = 'Appointment booked successfully!';
        this.appointmentForm.reset();
        this.showForm = false;
        this.loadAppointments();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Booking failed!';
      }
    });
  }

  deleteAppointment(id: number) {
    this.appointmentService.delete(id).subscribe({
      next: () => this.loadAppointments()
    });
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.router.navigate(['/login']);
  }
}