import { Component, Input, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateObjectComponent } from 'src/app/shared/components/add-update-object/add-update-object.component';
import { orderBy } from 'firebase/firestore'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  products: Product[] = [];

  constructor() { }

  ngOnInit() {
  }

  user(): user{
    return this.utilsSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 2000);
  }

  //------SIGN OUT------
  signOut(){
    this.firebaseSvc.signOut();
  }

  //------ADD UPDATE OBJECT-------
  async addUpdateObject(product?: Product){
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateObjectComponent,
      cssClass: 'add-update-modal',
      componentProps: {product}
    })

    if(success){
      this.getProducts();
    }
  }

  //------GET PRODUCTS IN HOME-----
  getProducts(){
    let path = `users/${this.user().uid}/products`;

    let query = (
      orderBy('soldUnits', 'desc')
    )

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) =>{
        console.log(res);
        this.products = res;
        sub.unsubscribe;
      }
    })
  }

  async deleteProduct(product: Product) {

    let path = `users/${this.user().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.products = this.products.filter(p => p.id !== product.id);

      this.utilsSvc.presentToast({
        message: 'Product delete successful',
        duration: 4000,
        color: 'success',
        position: 'bottom',
        icon: 'checkmark-done-outline'
      })

    }).catch(error => {

      console.log(error);

      this.utilsSvc.presentToast({
        message: 'Product havent delete yet',
        duration: 4000,
        color: 'danger',
        position: 'bottom',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    })
  }

  async corfirmDeleteProduct(product: Product) {
    this.utilsSvc.presentAlert({
      header: 'Delete',
      mode: 'ios',
      message: 'Deseas eliminar el producto?',
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
  }

}
