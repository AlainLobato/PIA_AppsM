import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActionSheetController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent  implements OnInit {

  constructor() { }

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  router = inject(Router);
  actionSheetCtrl = inject(ActionSheetController);

  form = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(4)])
  })

  user(): user{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ngOnInit() {
    
  }

  async submit(){
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.updateUser(this.user().name).then(() => {
          this.utilsSvc.presentToast({
            message: 'User updated successfully',
            duration: 4000,
            color: 'success',
            position: 'bottom',
            icon: 'checkmark-done-outline'
          });
        }).catch(error => {

        console.log(error);
        
        this.utilsSvc.presentToast({
          message: 'User have already exist',
          duration: 4000,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        })

      }).finally(()=>{
        loading.dismiss();
      })
    }
  }

  //------OPTIONS TO SELECT IMAGE-------
  async optionsToSelectImage() {
    const actionSheet = await this.actionSheetCtrl.create({
      mode: 'ios',
      header: 'Select Image',
      buttons: [
        {
          text: 'Select image from gallery',
          handler: () => {
            this.selectImage();
          },
        },
        {
          text: 'Take a photo',
          handler: () => {
            this.takeImage();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }


  //------TAKE PHOTO-------
  async takeImage() {

    let user = this.user();
    const dataUrl = (await this.utilsSvc.takePicture()).dataUrl;
    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    let path = `users/${user.uid}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async res => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Image update',
        duration: 4000,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-done-outline'
      })

    }).catch(error => {

      console.log(error);

      this.utilsSvc.presentToast({
        message: 'Image havent update yet',
        duration: 4000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    })
  }

  //-------SELECT IMAGE FROM GALLERY-----
  async selectImage() {


    let user = this.user();
    const dataUrl = (await this.utilsSvc.selectPicture()).dataUrl;
    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);

    let path = `users/${user.uid}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async res => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Image update',
        duration: 4000,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-done-outline'
      })

    }).catch(error => {

      console.log(error);

      this.utilsSvc.presentToast({
        message: 'Image havent update yet',
        duration: 4000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    })
  }

  doRefresh(event) {
    setTimeout(() => {
      this.routerlink('main/profile');
      event.target.complete();
    }, 2000);
  }

  routerlink(url: string){
    this.router.navigateByUrl(url);
  }

}
