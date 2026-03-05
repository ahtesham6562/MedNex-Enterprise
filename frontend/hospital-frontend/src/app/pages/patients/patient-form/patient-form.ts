import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient';

// ✅ Custom Validator: Phone number
function phoneValidator(control: AbstractControl) {
  const phone = control.value;
  if (phone && !/^\d{10}$/.test(phone)) {
    return { invalidPhone: true };
  }
  return null;
}

// ✅ Custom Validator: Future date not allowed
function pastDateValidator(control: AbstractControl) {
  const date = new Date(control.value);
  if (date > new Date()) {
    return { futureDate: true };
  }
  return null;
}

@Component({
  selector: 'app-patient-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css'
})
export class PatientForm implements OnInit {

  patientForm!: FormGroup;
  loading = false;
  isEditMode = false;
  patientId: number | null = null;
  submitted = false;

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  genders = ['Male', 'Female', 'Other'];
  maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  relationships = ['Self', 'Spouse', 'Parent', 'Child', 'Sibling', 'Other'];
  religions = ['Islam', 'Hinduism', 'Christianity', 'Sikhism', 'Other'];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.buildForm();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.patientId = +id;
      this.loadPatient(+id);
    }
  }

  buildForm() {
    this.patientForm = this.fb.group({

      // ===== PERSONAL INFO =====
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      fatherName: ['', Validators.required],
      motherName: ['', Validators.required],
      dateOfBirth: ['', [Validators.required, pastDateValidator]],
      gender: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      religion: [''],
      nationality: ['Pakistani', Validators.required],
      cnicNumber: ['', [Validators.required, Validators.pattern(/^\d{13}$|^\d{5}-\d{7}-\d{1}$/)]],

      // ===== CONTACT INFO =====
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, phoneValidator]],
      alternatePhone: ['', phoneValidator],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['Pakistan', Validators.required],
      postalCode: ['', Validators.required],

      // ===== EMERGENCY CONTACT =====
      emergencyContactName: ['', Validators.required],
      emergencyContactPhone: ['', [Validators.required, phoneValidator]],
      emergencyContactRelation: ['', Validators.required],
      emergencyContactAddress: [''],

      // ===== MEDICAL INFO =====
      age: [null, [Validators.required, Validators.min(0), Validators.max(150)]],
      bloodGroup: ['', Validators.required],
      height: [null, [Validators.min(0), Validators.max(300)]],
      weight: [null, [Validators.min(0), Validators.max(500)]],
      allergies: [''],
      currentMedications: [''],
      pastMedications: [''],
      chronicDiseases: [''],
      surgicalHistory: [''],
      familyMedicalHistory: [''],
      smokingStatus: ['Non-Smoker'],
      alcoholConsumption: ['None'],
      exerciseFrequency: [''],

      // ===== ADMISSION INFO =====
      admissionDate: ['', Validators.required],
      admissionReason: ['', Validators.required],
      referredBy: [''],
      ward: [''],
      roomNumber: [''],
      bedNumber: [''],

      // ===== INSURANCE INFO =====
      insuranceProvider: [''],
      insurancePolicyNumber: [''],
      insuranceExpiryDate: [''],
      insuranceCoverage: [''],

      // ===== VITALS =====
      bloodPressure: [''],
      heartRate: [null],
      temperature: [null],
      oxygenSaturation: [null],
      respiratoryRate: [null],

      // ===== ADDITIONAL =====
      notes: [''],
      consentSigned: [false, Validators.requiredTrue],
      privacyAcknowledged: [false, Validators.requiredTrue],
    });
  }

  loadPatient(id: number) {
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        this.patientForm.patchValue(patient);
        if (patient.medicalHistory) {
          const history = JSON.parse(patient.medicalHistory);
          this.patientForm.patchValue(history);
        }
      }
    });
  }

  get f() { return this.patientForm.controls; }

  onSubmit() {
    this.submitted = true;

    // ✅ DEBUG: kaunse fields invalid hain
    console.log('Form Valid:', this.patientForm.valid);
    Object.keys(this.patientForm.controls).forEach(key => {
      if (this.patientForm.get(key)?.invalid) {
        console.log('❌ Invalid Field:', key, this.patientForm.get(key)?.errors);
      }
    });

    if (this.patientForm.invalid) return;

    this.loading = true;

    const formValue = this.patientForm.value;

    const medicalHistory = JSON.stringify({
      bloodGroup: formValue.bloodGroup,
      height: formValue.height,
      weight: formValue.weight,
      allergies: formValue.allergies,
      currentMedications: formValue.currentMedications,
      pastMedications: formValue.pastMedications,
      chronicDiseases: formValue.chronicDiseases,
      surgicalHistory: formValue.surgicalHistory,
      familyMedicalHistory: formValue.familyMedicalHistory,
      smokingStatus: formValue.smokingStatus,
      alcoholConsumption: formValue.alcoholConsumption,
      exerciseFrequency: formValue.exerciseFrequency,
      bloodPressure: formValue.bloodPressure,
      heartRate: formValue.heartRate,
      temperature: formValue.temperature,
      oxygenSaturation: formValue.oxygenSaturation,
      respiratoryRate: formValue.respiratoryRate,
      admissionReason: formValue.admissionReason,
      referredBy: formValue.referredBy,
      ward: formValue.ward,
      roomNumber: formValue.roomNumber,
      bedNumber: formValue.bedNumber,
      insuranceProvider: formValue.insuranceProvider,
      insurancePolicyNumber: formValue.insurancePolicyNumber,
    });

    const patient = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      age: formValue.age,
      gender: formValue.gender,
      phone: formValue.phone,
      medicalHistory
    };

    if (this.isEditMode && this.patientId) {
      this.patientService.updatePatient(this.patientId, patient).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/patients']); },
        error: () => { this.loading = false; }
      });
    } else {
      this.patientService.createPatient(patient).subscribe({
        next: () => { this.loading = false; this.router.navigate(['/patients']); },
        error: () => { this.loading = false; }
      });
    }
  }
}