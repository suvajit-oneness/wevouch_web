import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/user/layouts/header/header.component';
import { SidebarComponent } from './component/user/layouts/sidebar/sidebar.component';
import { DashboardComponent } from './component/user/dashboard/dashboard.component';
import { ProductListComponent } from './component/user/product/product-list/product-list.component';
import { ProductAddComponent } from './component/user/product/product-add/product-add.component';
import { ProductDetailComponent } from './component/user/product/product-detail/product-detail.component';
import { LoginComponent } from './component/auth/login/login.component';
import { RegistrationComponent } from './component/auth/registration/registration.component';
import { ForgetComponent } from './component/auth/password/forget/forget.component';
import { ChangeComponent } from './component/auth/password/change/change.component';
import { TicketAddComponent } from './component/user/ticket/ticket-add/ticket-add.component';
import { TicketListComponent } from './component/user/ticket/ticket-list/ticket-list.component';
import { TicketDetailComponent } from './component/user/ticket/ticket-details/ticket-details.component';
import { ExtendedWarrantyComponent } from './component/user/product/extended-warranty/extended-warranty.component';
import { AmcDetailsComponent } from './component/user/product/amc-details/amc-details.component';
import { ProfileComponent } from './component/user/profile/profile.component';
import { ProductCategoryComponent } from './component/user/product-category/product-category.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {DpDatePickerModule} from 'ng2-date-picker';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    DashboardComponent,
    ProductAddComponent,
    ProductListComponent,
    ProductDetailComponent,
    LoginComponent,
    TicketAddComponent,
    TicketListComponent,
    TicketDetailComponent,
    RegistrationComponent,
    ForgetComponent,
    ChangeComponent,
    ExtendedWarrantyComponent,
    AmcDetailsComponent,
    ProfileComponent,
    ProductCategoryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgxUiLoaderModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DpDatePickerModule,
    CarouselModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
