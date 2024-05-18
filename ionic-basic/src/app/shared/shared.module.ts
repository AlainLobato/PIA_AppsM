import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateObjectComponent } from './components/add-update-object/add-update-object.component';
import { FooterComponent } from './components/footer/footer.component';
import { EditProfileComponent } from './components/edit-profile/edit-profile.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { HttpClientModule } from '@angular/common/http';
import { UtilsService } from '../services/utils.service';



@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateObjectComponent,
    FooterComponent,
    EditProfileComponent,
    AddTaskComponent
  ],
  exports: [
    ReactiveFormsModule,
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    AddUpdateObjectComponent,
    FooterComponent,
    EditProfileComponent,
    AddTaskComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [UtilsService]
})
export class SharedModule { }
