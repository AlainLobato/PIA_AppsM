import { Inject, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, AlertOptions, IonSpinner, LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { AddUpdateObjectComponent } from '../shared/components/add-update-object/add-update-object.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);
  modalCtrl = inject(ModalController);
  alertCtrl = inject(AlertController);
  http = inject(HttpClient)

  getProducts(params: any) {
    return this.http.get(environment.BaseUrl + environment.products, { params });
  }  

  //----------------LOADING-----------------
  loading() {
    return this.loadingCtrl.create({
      spinner: 'lines-sharp-small',
      message: 'Loading',
      duration: 3000,
    });
  }

  //--------------ALERT--------------------
  async presentAlert(opts?: AlertOptions) {
    const alert = await this.alertCtrl.create(opts);
  
    await alert.present();
  }

  //--------------TOAST--------------------
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //-------------RUTA A PAGINA DISPONIBLE-----------
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }


  //------GUARDAR ELEMENTO EN LOCAL STORAGE-----------
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value))
  }

  //-----OBTENER ELEMENTO DESDE LOCAL STORAGE---------
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }

  //-----------MODAL----------
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      return data;
    }
  }

  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }

  
  //------TAKE PICTURE-------
  async takePicture (){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera
    });
  };

  //------SELECT IMAGE--------
  async selectPicture (){
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos
    });
  };
}
