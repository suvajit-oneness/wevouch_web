import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css'],
})
export class ProductCategoryComponent implements OnInit {
  title = 'ng-carousel-demo';
   
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    navText:["P<br>R<br>E<br>V","N<br>E<br>X<br>T"],
    dots: false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }


  public categoryList: any = [];
  public productList: any = [];
  public allProductList: any = [];
  public selectedCategory: string = 'all';
  public userDetails: any = '';
  constructor(private _loader: NgxUiLoaderService, private _api: ApiService) {}

  ngOnInit(): void {

    this.userDetails = JSON.parse(localStorage.getItem('we_vouch_user'));
    
    this._api.categoryList().subscribe((res) => {
      this.categoryList = res.filter((t) => t.status === 'active');
    });

    this._api.productList(this.userDetails._id).subscribe((res) => {
      const dDate = new Date();
      res.map((item) => {
        let purchaseDate = new Date(item.purchaseDate);
        item.expiryDate = purchaseDate.setMonth(purchaseDate.getMonth()+item.warrantyPeriod);
      });
      this.productList = res.filter((t) => t.status === 'active');
      this.allProductList = this.productList;
      this._loader.stopLoader('loader');
    });
  }

  getProductsByCategory(value) {
    if (value === 'all') {
      this.productList = this.allProductList;
      this.selectedCategory = 'all';
    } else {
    //   document.getElementById('other-slider').classList.add('active');
    //   document.getElementById('all-slider').classList.remove('active');
      this.selectedCategory = value.name;
      const formData = {
        "categoryId": value._id, 
        "userId": this.userDetails._id
      };
      console.log(formData);
      this._api.productListByUserAndCategory(formData).subscribe(
        res => {
          console.log(res);
          
          // const dDate = new Date();
          // res.map((item) => {
          //   item.differenceInTime =
          //     dDate.getTime() - new Date(item.purchaseDate).getTime();
          //   item.differenceInDays = item.differenceInTime / (1000 * 3600 * 24);
          //   item.expiryDate = new Date(
          //     dDate.setDate(dDate.getDate() + item.differenceInDays)
          //   ).toDateString();
          // });
          // this.productList = res.filter((t) => t.status === 'active');
          this.productList = res;
        }
      );
    }
  }
}
