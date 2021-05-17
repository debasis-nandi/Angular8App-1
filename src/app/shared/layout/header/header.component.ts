import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { HttpService } from '../../../core/services/http.service';
import { ApiConfig } from '../../../core/config/api-config';
import { AppSession } from '../../../core/config/app-session';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {

  activeInfo: any;
  userName: string;
  activeClient: string;
  activeRole: string;
  selectedAccountName: string;
  selectedAccountId: any;
  roleDetails: any[] = [];

  constructor(private router: Router, private service: HttpService) {
  }

  ngOnInit() {
    if(AppSession.getSessionStorage("UserInfo")){
      let userInfo: any = AppSession.getSessionStorage("UserInfo");
      this.userName = userInfo.user;
      this.activeClient = userInfo.clientname;
      this.roleDetails = userInfo.role_detail;
      //this.activeRole = this.roleDetails.length > 0 ? this.roleDetails[0].rolename : '';

      if(AppSession.getSessionStorage("SelectedAccount")){
        this.selectedAccountId = parseInt(AppSession.getSessionStorage("SelectedAccount"));
        this.selectedAccountName = this.roleDetails.filter(x=>x.accountid == this.selectedAccountId)[0].accountname;
        this.activeRole = this.roleDetails.filter(x=>x.accountid == this.selectedAccountId)[0].rolename;
      }
      else{
        this.selectedAccountName = this.roleDetails.length > 0 ? this.roleDetails[0].accountname : '';
        this.selectedAccountId = this.roleDetails.length > 0 ? this.roleDetails[0].accountid : '';
        this.activeRole = this.roleDetails.length > 0 ? this.roleDetails[0].rolename : '';
      }
    }
  }

  onAccountChange(e: any) {
    if (confirm("Do you want to switch the account?")) {
      this.selectedAccountId = e.value;
      this.router.navigate(['login/bridge', this.selectedAccountId]);
    }
    else {
      e.preventDefault();
    }
  }

  logout(){
    AppSession.clearSessionStorage("token");
    this.router.navigateByUrl('login');
  }

}