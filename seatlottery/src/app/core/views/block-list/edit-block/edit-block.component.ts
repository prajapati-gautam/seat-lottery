import { Component, OnInit, Inject, ViewChild, OnDestroy, OnChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { differenceWith, isEqual } from 'lodash';
import { FormCanDeactivate } from '../../../../auth/form-can-deactivate';
import { ToastaService, ToastOptions, ToastData } from 'ngx-toasta';
import { baseService } from '../../../../core/services/base.service';

@Component({
  selector: 'app-edit-block',
  templateUrl: './edit-block.component.html',
  styleUrls: ['./edit-block.component.css']
})

export class EditBlockComponent extends FormCanDeactivate implements OnInit {

  @ViewChild('form')
  form: FormGroup;

  public title: string;
  public field_no_of_seats: string;
  public field_seats: string = "";
  public isValidForm: boolean = true;
  public isFormChanged: boolean = false;
  private blockData: object;
  private compareSet;
  public formError = "";
  public numOfSeats = 0;
  stadium_id: number;
  loaderHidden = true;

  public getChanges(orginalCollection: any, changedCollection: any): any {
    return differenceWith(changedCollection, orginalCollection, isEqual);
  }

  constructor(
    private srvs: baseService,
    private fb: FormBuilder,
    private toastaService: ToastaService,
    private router: Router,
    private dialogRef: MatDialogRef<EditBlockComponent>,
    @Inject(MAT_DIALOG_DATA) data) {
    super();
    this.compareSet = {
      'title': '',
      'field_no_of_seats': '',
      'field_seats': ''
    }
    this.stadium_id = data.stadium_id;
    this.blockData = data;
    this.title = data.title;
    this.field_no_of_seats = data.field_no_of_seats;
    this.field_seats;
  }

  blockSuccess: ToastOptions = {
    title: "Block Update",
    msg: "The Block updated succesfully.",
    timeout: 3000,
    onRemove: (toast: ToastData) => {
      window.location.reload();
    }
  }
  blockError: ToastOptions = {
    title: "Oops!",
    msg: "some blocks are not update!",
    timeout: 5000
  }

  blockUpdating: ToastOptions = {
    title: "Block Update",
    msg: "Wait we are updating blocks...",
    timeout: 2500
  }

  ngOnInit() {

    this.compareSet['title'] = this.blockData['title'];
    this.compareSet['field_no_of_seats'] = this.blockData['field_no_of_seats'];
    this.compareSet['field_seats'] = '';

    this.form = this.fb.group({
      title: [this.title, Validators.required],
      field_no_of_seats: [this.field_no_of_seats, Validators.required],
      field_seats: ['', Validators.required]
    });

    this.numOfSeats = this.form.value['field_no_of_seats'];

    this.form.valueChanges.subscribe(data => {
      let isChanged = this.getChanges([this.compareSet], [data]);
      if (isChanged.length > 0) {
        this.isFormChanged = true;
      } else {
        this.isFormChanged = false;
      }
    })
  }

  clearSeats(seats: string = "") {
    const divideIt = seats.split('\n');
    const finalSeats = divideIt.reduce((seats, value) => {
      return !seats.includes(value) ? seats.concat(value) : seats
    }, []).join(',').split(',');
    const filtered = finalSeats.filter(v => v != '');
    let allSeats = new Array();

    filtered.forEach(element => {
      let seat = new Object();
      seat['title'] = element;
      seat['id'] = this.makeid() + '_' + seat['title'].replace(/\s/g, '-');
      allSeats.push(seat)
    });

    return allSeats;
  }

  makeid() {
    let cusstr = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let blockTicketNumber = this.form.value['title'].replace(/\s/g, '-');
    for (var i = 0; i < 6; i++)
      cusstr += possible.charAt(Math.floor(Math.random() * possible.length));
    return this.blockData['field_ticket_tag'] + '_' + blockTicketNumber + '_' + cusstr;
  }

  save() {
    if (this.form.invalid) { this.formError = "Fill all fields."; return }
    else { this.formError = ""; };
    if (this.isFormChanged) {
      this.loaderHidden = false;
      this.toastaService.info(this.blockUpdating);
      const allSeats = this.form.value['field_seats'];
      const finalSeats = this.clearSeats(allSeats);
      const newFormData = new Object();
      newFormData['uuid'] = this.blockData['uuid'];
      newFormData['title'] = this.form.value['title'];
      newFormData['field_no_of_seats'] = this.form.value['field_no_of_seats'];
      newFormData['number_of_seats'] = finalSeats;
      newFormData['nid'] = this.blockData['nid'];
      newFormData['field_ticket_tag'] = this.blockData['field_ticket_tag'];
      this.srvs.updateBlock(newFormData, (response) => {
        response.subscribe(r => { })
      });

      this.srvs.updateBlockSeats(newFormData, (response) => {
        this.loaderHidden = true;
        let s : Array<any> = [];
        let e : Array<any> = [];

        for (const iterator of response) {
          if (iterator.hasOwnProperty('msg')) {
            e.push(iterator['msg']);
            this.blockError.msg = iterator['msg'];
            this.toastaService.error(this.blockError);
          }
          if (iterator.hasOwnProperty('changed')) {
            s.push(iterator);
          }
          if (s.length == finalSeats.length) {
            this.toastaService.success(this.blockSuccess);
            this.close();
          }
        }
      });
    }
    else {
      this.close()
    }
  }

  close() {
    this.dialogRef.close();
  }

}

