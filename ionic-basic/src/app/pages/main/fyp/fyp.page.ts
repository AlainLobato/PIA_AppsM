import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { user } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-fyp',
  templateUrl: './fyp.page.html',
  styleUrls: ['./fyp.page.scss']
})
export class FypPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  http = inject(HttpClientModule)

  constructor() { }

  products: Product[] = [];
  params: any = [];

  ngOnInit() {
    this.params.page = 0;
    this.products
  }

  user(): user{
    return this.utilsSvc.getFromLocalStorage('user');
  }


  ionViewWillEnter() {
    this.getProducts();
  }

  getProducts(event?: any) {
    this.params.page = this.params.page + 5;
  
    this.utilsSvc.getProducts(this.params).subscribe(
      (res: any[]) => {
        res.forEach((item) => {
          this.products.push(item);
        });
        console.log(res);
      }
    );
  }
  


}
