import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

declare var $: any;

@Component({
  selector: 'main-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  public showModal: boolean = false;
  private observable: Observable<any>;
  private subscription: Subscription | null = null;
  @ViewChild('modal')
  modal!: TemplateRef<ElementRef>;

  constructor( private modalService: NgbModal) {
    this.observable = new Observable<NgbModalRef>((observer) => {
      setTimeout(() => {
        observer.next(this.modalService.open(this.modal));
      }, 10000);
    });
  }

  ngOnInit(): void {
    let accordion = $('#accordion');
    accordion.accordion({
      heightStyle: 'content',
    });


    this.subscription = this.observable
      .subscribe({
        next: (param) => {
          console.log(param);
        },
        error: (error: string) => {
          console.log('error: ' + error);
        }
      })

  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }


}
