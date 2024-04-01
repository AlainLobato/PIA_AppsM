import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  async submit(){
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as user).then(res =>{

        this.getUserInfo(res.user.uid);

      }).catch(error => {

        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Auth Error: Email or Password is incorrect',
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


  async getUserInfo(uid: string){
    if (this.form.valid) {

      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;

      this.firebaseSvc.getDocument(path).then((user: user) =>{

        this.utilsSvc.saveInLocalStorage('user', user);
        this.utilsSvc.routerLink('main/home');
        this.form.reset();

        this.utilsSvc.presentToast({
          message: `Welcome, ${user.name}`,
          duration: 1500,
          color: 'success',
          position: 'bottom',
          icon: 'person-circle-outline'
        })

      }).catch(error => {

        console.log(error);

        this.utilsSvc.presentToast({
          message: 'Auth Error: Email or Password is incorrect',
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
}
