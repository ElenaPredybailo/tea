import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {OrderService} from "../../shared/services/order.service";


@Component({
  selector: 'order-component',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit, OnDestroy {

  private subscription: Subscription | null = null;
  private subscriptionOrder: Subscription | null = null;
  public blockShow: Boolean = false;
  public formShow: Boolean = true;
  public textShow: Boolean = false;
  checkoutForm = this.fb.group({
    product: [{value: '', disabled: true}, [Validators.required]],
    firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я]+$')]],
    lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я]+$')]],
    phone: ['', [Validators.required, Validators.pattern('^[/+]?[0-9]{11}$')]],
    country: ['', [Validators.required]],
    index: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    address: ['', [Validators.required, Validators.pattern('^[a-zA-Zа-яА-Я0-9\-\/ ]+$')]],
    comment: ['']
  })

  constructor(private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private orderService: OrderService) {
  }

  ngOnInit(): void {
    this.subscription = this.activatedRoute.queryParams.subscribe((params) => {
      if (params['product']) {
        this.checkoutForm.controls.product.setValue(params['product']);
      }
    })
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
    this.subscriptionOrder?.unsubscribe();
  }

  public createOrder() {
    if (this.checkoutForm.controls.firstName.value &&
      this.checkoutForm.controls.lastName.value &&
      this.checkoutForm.controls.phone.value &&
      this.checkoutForm.controls.country.value &&
      this.checkoutForm.controls.index.value &&
      this.checkoutForm.controls.product.value &&
      this.checkoutForm.controls.address.value) {
      this.subscriptionOrder = this.orderService.createOrder({
        name: this.checkoutForm.controls.firstName.value,
        last_name: this.checkoutForm.controls.lastName.value,
        phone: this.checkoutForm.controls.phone.value,
        country: this.checkoutForm.controls.country.value,
        zip: this.checkoutForm.controls.index.value,
        product: this.checkoutForm.controls.product.value,
        address: this.checkoutForm.controls.address.value,
        comment: this.checkoutForm.controls.comment.value
      })
        .subscribe(
          {
            next: response => {
              let that = this;
              if (response.success && !response.message) {
                this.formShow = false;
                this.blockShow = true;
                this.checkoutForm.reset();
                // setTimeout(function () {
                //   that.blockShow = false;
                //   that.formShow = true;
                // }, 3000);
              } else {
                console.log(response.message);
              }
            },
            error: error => {
              console.log(error);
              this.textShow = true;
              let that = this;
              setTimeout(function () {
                that.textShow = false;
              }, 3000);
            }
          });
    }
  }

}
