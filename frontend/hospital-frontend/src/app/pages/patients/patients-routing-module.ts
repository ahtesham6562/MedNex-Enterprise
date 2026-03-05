import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PatientList } from './patient-list/patient-list';
import { PatientForm } from './patient-form/patient-form';

const routes: Routes = [
  { path: '', component: PatientList },
  { path: 'add', component: PatientForm },
  { path: 'edit/:id', component: PatientForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientsRoutingModule {}