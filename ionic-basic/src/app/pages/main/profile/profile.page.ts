import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ActionSheetController } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { EditProfileComponent } from 'src/app/shared/components/edit-profile/edit-profile.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService)
  utilsSvc = inject(UtilsService)
  router = inject(Router);
  actionSheetCtrl = inject(ActionSheetController);

  constructor() { }

  ngOnInit() {
  }

  user(): user{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  async updateUser(user?: user){
    let success = await this.utilsSvc.presentModal({
      component: EditProfileComponent,
      cssClass: 'add-update-modal',
      componentProps: {user}
    })

    if(success){
      this.routerlink('main/profile');
    }
  }

  routerlink(url: string){
    this.router.navigateByUrl(url);
  }

  doRefresh(event) {    
    setTimeout(() => {
      this.routerlink('main/profile');
      event.target.complete();
    }, 2000);
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

  //------SIGN OUT------
  signOut(){
    this.firebaseSvc.signOut();
  }

}
