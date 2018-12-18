import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { ApiService } from './api.service';


import { API } from '../api';
import { environment } from '../../../environments/environment';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';

let httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable()
export class baseService {
  private token: Object;
  public _blockuuid: string = '';
  public _stadiumuuid: string = '';
  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private as: ApiService
  ) {

    const res = this.auth.getSecureToken();
    if (res !== null && res.hasOwnProperty('uid'))
      this.token = res;
    else
      this.token = {}
  }



  baseurl() { return API.BASEURL; }
  getActiveParamFromUrl(param, callback) {
    this.activeRoute.params.subscribe((routeParams) => {
      let prm = routeParams[param];
      callback(prm);
    });
  }

  getBlockByID(id, blocks, callback): void {
    blocks.map((block) => {
      block.nid === id ? callback(block) : '';
    });
  }

  gotoPage(url) {
    this.route.navigateByUrl(url);
  }

  /* API REQUESTS */

  login(user) {
    const data = { "name": user.user, "pass": user.pass };
    const response = this.as.post(API.LOGIN, API.FORMAT, data, false);
    return response;
  }

  getVenues() {
    let uid = this.token['uid'];
    const response = this.as.get(API.VENUES, uid, API.FORMAT);
    return response;
  }
  getBlocks(nid) {
    const response = this.as.get(API.BLOCKS, nid, API.FORMAT);
    return response;
  }
  getStadiumAssets(nid) {
    const response = this.as.get(API.STADIUM_ASSETS, nid, API.FORMAT);
    return response;
  }



  updateBlock(data: Object = {}, callback: Function) {
    let body: Object = {
      "_links": { "type": { "href": "https://yocat.net/backend/rest/type/node/block" } },
      "nid": { "": { "value": data['nid'] } }, "type": { "target_id": "block" }, "title": { "value": data['title'] }, "field_no_of_seats": [{ "value": data['field_no_of_seats'] }]
    }

    let response = this.as.patch(API.UPDATE_STADIUM + data['nid'] + API._FORMAT, body, true);
    callback(response);
  }

  updateBlockSeats(data: Object = {}, callback: Function) {
    const field_seats = data['number_of_seats'];
    if (field_seats.length == 0) return;
    let updateRsponse = [];
    let step = 0;

    let d = setInterval(() => {
      if (typeof field_seats[step] !== 'undefined') {

        let body: Object = {
          "_links": { "type": { "href": "https://yocat.net/backend/rest/type/node/seat" } },
          "title": [{ "value": field_seats[step].title }],
          "field_seat_no_": [{ "value": field_seats[step].id }],
          "field_status": [{ "value": "0" }],
          "_embedded": { "https://yocat.net/backend/rest/relation/node/seat/field_block": [{ "uuid": [{ "value": data['uuid'] }] }] }
        }

        this.as.post(API.UPDATE_STADIUM, API._FORMAT, body)
          .subscribe(
            r => { updateRsponse.push(r); },
            e => { updateRsponse.push(e['_body']); }
          );
        step++;
      }
    }, 500);
    let x = setInterval(() => {
      if (updateRsponse.length === field_seats.length) {
        clearInterval(d);
        clearInterval(x);
        step = 0;
        callback(updateRsponse);
      }
    }, 100);
  }




  updateMapLayout(nid, element) {
    let body: object = {
      "_links": {
        "type": {
          "href": "https://yocat.net/backend/rest/type/node/stadium"
        }
      },
      "nid": {
        "": { "value": nid }
      },
      "type": {
        "target_id": "stadium"
      },
      "field_finished_stadium": [
        {
          "value": element,
          "format": "full_html"
        }
      ]
    }
    return this.as.patch(API.UPDATE_STADIUM + nid + API._FORMAT, body, true);
  }

}
