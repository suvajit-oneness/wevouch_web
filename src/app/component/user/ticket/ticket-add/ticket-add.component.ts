import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {ActivatedRoute, Router} from "@angular/router";
import  Swal  from "sweetalert2";
import { getDateFormat } from "src/app/service/globalFunction";

@Component({
  selector: 'app-ticket-add',
  templateUrl: './ticket-add.component.html',
  styleUrls: ['./ticket-add.component.css'],
})

export class TicketAddComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  @ViewChild('addressForm') addressForm;

  public issueType: string = '';
  public functionType: string = '';
  public description: string = '';
  public errorMessage: string = '';
  public isFirstTab: boolean = true;
  public isSecondTab: boolean = false;
  public transportationType: string = "On Site";
  public addressId: string = "";
  public isThirdTab: boolean = false;
  public selectedDate: string = "";
  public selectedTime: string = "";
  public Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  public user : any = JSON.parse(localStorage.getItem('we_vouch_user') || '{}');
  public userAddresses : any = []
  public addressData : any = {}
  public addressErrorMessage : any = ''
  public supportExecutives : any = new Array()
  public cityData : any = [];
  public selectedCity : any = '';
  public brandId : any = '';
  public serviceCenters : any = [];
  public productDetails : any = [];
  public minDate : any = getDateFormat(Date.now());
  public someDate = new Date();
  public maxDate : any = getDateFormat(this.someDate.setDate(this.someDate.getDate() + 10));

  constructor(private _api: ApiService, private _loader: NgxUiLoaderService, private route: ActivatedRoute, private _router: Router) {}

  ngOnInit(): void {
    this.getAddressData();
    this._api.userDetails(this.user._id).subscribe(
      res => {
        this.user = res;
      }
    )
    this._api.getProductDetailsById(this.route.snapshot.paramMap.get('productId')).subscribe(
      res => {
        console.log(res);
        this.productDetails = res;
        if(this.productDetails?.brands == '' || this.productDetails?.category == '' || this.productDetails?.modelNo == '' || this.productDetails?.subCategory == '') {
          Swal.fire({
            title: 'Failed!',
            text: 'You need to add brand, category, sub category, model no to your product.',
            icon: 'error',
            confirmButtonText: 'Edit product',
          }).then((result) => {
            if (result.isConfirmed) {
              this._router.navigate(['/user/product/edit/'+this.route.snapshot.paramMap.get('productId')])
            }
          })
        }
        this.fetchBrands();
        this._api.getCities().subscribe(
          res=> {
            this.cityData = res.cities;
            console.log('city', this.cityData);
            this.selectedCity = this.cityData[0].name;
            this.selectCity();
          }
        )
      }
    )
  }

  fetchBrands() {
    this._api.getProductBrands().subscribe(
      res => {
        this.brandId = res.brands.filter((t : any) => t.name === this.productDetails.brands)[0].id;
      }, err => {}
    )
  }

  selectCity() {
    console.log('city: ',this.selectedCity);
    console.log('brand: ',this.brandId);
    
    this._api.getServiceCenter(this.brandId, this.selectedCity).subscribe(
      res => {
        console.log('service center: ', res);
        this.serviceCenters = res.service_centers;
      }, err => {}
    )
  }
  
  getAddressData() {
    this._api.getAddressListByUser(this.user._id).subscribe(
      res => {
        this._loader.startLoader('loader');
        console.log('address :',res);        
        this.userAddresses = res;
        this._loader.stopLoader('loader');
      }, err => {}
    )
  }

  secondTab() {
    if (this.issueType && this.functionType && this.description) {
      this.errorMessage="";
      this.isFirstTab= false;
      this.isSecondTab= true;
    } else {
      this.errorMessage = 'Please give all the details';
    }
  }

  goToLast()
  {
    if(this.addressId && this.transportationType)
    {
      this.isSecondTab = false;
      this.isThirdTab= true;
      this.errorMessage= "";
    }
    else
    {
      this.errorMessage=" Please give the address";
    }
  }

  submitTicket()
  {
    
    
    this.errorMessage = '';
    if(this.selectedDate && this.selectedTime) {
      if (this.selectedTime >= '10:00' && this.selectedTime <= '17:00') {
        console.log(this.selectedTime);
        this._loader.startLoader('loader');
        if(localStorage.getItem("we_vouch_user")) {
          
          const userId = JSON.parse(localStorage.getItem("we_vouch_user"))._id;
          const tosendData = {
            issueType: this.issueType,
            functionType: this.functionType,
            description: this.description,
            transportationType: this.transportationType,
            addressId: this.addressId,
            selectedDate: this.selectedDate,
            selectedTime: this.selectedTime,
            userId,
            productId: this.productDetails._id,
            category: this.productDetails.category,
            brandId: this.productDetails.brands
          };
          this._api.addTicket(tosendData).subscribe(
            res=>{
              console.log(res);
              const addedTicketDetail = res.ticket;
              this.assignTicket(res.ticket._id);
              this._api.updateUserLocally(this.user);
              this.Toast.fire({
                icon: 'success',
                title: 'Tcket raised successfully!'
              })
              const notificationForm = {
                "title": "Ticket raised", 
                "userId": this.user._id, 
                "description": "Dear "+this.user.name+", your ticket "+addedTicketDetail.uniqueId+" has been raised for the product "+this.productDetails.name+"."
              }
              this._api.addNotification(notificationForm).subscribe();
              this._router.navigate(['/user/ticket/list']);
            }
          )
        }
      } else {
        this.errorMessage="Time should be from 10 am to 5 pm";
      }
    }
    else {
      this.errorMessage=" Please give all the details.";
    }
  }

  assignTicket(ticketId : any) {
    this._api.getSupportExcutives().subscribe(
      res => {
        this.supportExecutives = [];
        for (let index = 0; index < res.length; index++) {
          if (res[index].assigned === false) {
            this.supportExecutives.push(res[index]._id);
          }
        }
        if (this.supportExecutives.length) {
          const random = Math.floor(Math.random() * this.supportExecutives.length);
          console.log(random, this.supportExecutives[random]);
          const executiveForm = {
            "ticketId": ticketId, 
            "executiveId": this.supportExecutives[random]
          };
          this._api.assignTicketToExecutive(executiveForm).subscribe();
          this._api.changeExecutiveAssignStatus(this.supportExecutives[random], {assigned: true}).subscribe();
        } else {
          this._api.changeAllAssignStatus().subscribe(
            res => {
              this.assignTicket(ticketId);
            }, err => {}
          );
        }
        
      }, err => {}
    )
  }

  saveAddress(formData: any) {
    for (let i in formData.controls) {
      formData.controls[i].markAsTouched();
    }
    if (formData?.valid) {
      const mainForm = formData.value;
      mainForm.userId = this.user._id;
      mainForm.latitude = '';
      mainForm.longitude = '';
        this._api.addAddress(mainForm).subscribe(
          res => {
            this.closeModal();
            this._loader.startLoader('loader');
            this.Toast.fire({
              icon: 'success',
              title: 'Address added successfully!'
            })
            this.getAddressData();
            this.emptyModal();
            this._loader.stopLoader('loader');
          }, err => {
            this.addressErrorMessage = 'Something went wrong!';
          }
        )
    } else {
      this.addressErrorMessage = 'Please fill out all the details';
    }
  }

  emptyModal() {
    this.addressForm.reset();
  }

  closeModal() {
    this.emptyModal();
    this.closebutton.nativeElement.click();
  }
}
