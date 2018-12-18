import { Component, OnInit, Inject } from '@angular/core';
import { BaseService } from '../../common/services/base.service';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { ToastaService, ToastOptions, ToastData } from 'ngx-toasta';

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  block_id: number = null;
  selected_seat: string = "";
  public totleSeats: Array<object> = [];
  constructor(private dialogRef: MatDialogRef<SeatSelectionComponent>,
    private bs: BaseService,
    private toastaService: ToastaService,
    @Inject(MAT_DIALOG_DATA) data) {
    this.block_id = data['stadium_id'];
    this.bs.getSeatById(this.block_id).subscribe(response => {
      this.bs.hideLoader();
      this.totleSeats = response;
    })
  }

  blockSuccess: ToastOptions = {
    title: "Seat Selection",
    msg: "Your seat is selected successfully.",
    timeout: 2000,
    theme: 'default',
    onRemove: (toast: ToastData) => {
     this.bs.gotoPage('/checkout');
    }
  }

  blockError: ToastOptions = {
    title: "Seat selection",
    msg: "",
    timeout: 10000,
    showClose:true,
    theme: 'default',
  }

  ngOnInit() { }

  activeSeat(status: string) {
    return status === "booked";
  }

  close() {
    this.dialogRef.close();
  }

  checkAvailability(seat_id: number) {
    this.bs.updateSeatBooking(seat_id).subscribe(rs => {
      this.bs.hideLoader();
      this.bs.setToLocal('selected_seat', rs['field_seat_no_'][0]['value']);
      this.toastaService.success(this.blockSuccess);
      this.close();
    },
    (err)=>{
      this.blockError.msg = `Please <a target="_blank" href="https://www.yocat.net/user/">Visit Here</a> for Ticket booking.`;
      this.toastaService.info(this.blockError);
    }
    )
  }
}
