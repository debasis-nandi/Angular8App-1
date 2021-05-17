import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { AppSession } from '../../../core/config/app-session';
import { RoleType } from '../../../core/config/app-enum';
import { environment } from '../../../../environments/environment';
import { Router, NavigationEnd } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  imgPath: any = environment.imaPath;
  menuItems: any;
  adminItems: any;
  selectedAccount: any;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.menuItems = AppSession.getSessionStorage("Menu") ? AppSession.getSessionStorage("Menu") : null;
    this.adminItems = this.menuItems['Admin'];
    this.selectedAccount = AppSession.getSessionStorage("SelectedAccount") ? AppSession.getSessionStorage("SelectedAccount") : null;

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
    
  }

  ngAfterViewInit() {
    this.loadScript();
  }

  ngOnDestroy() {
  }

  isAdmin(): boolean{
    return  this.menuItems['Admin'].length > 0 ? true : false;
  }

  loadScript() {
    $(window).scroll(function () {
      if ($(this).scrollTop() > 50) {
        $('#back-to-top').fadeIn();
      } else {
        $('#back-to-top').fadeOut();
      }
    });

    $('#back-to-top').click(function () {
      $('#back-to-top').tooltip('hide');
      $('body,html').animate({
        scrollTop: 0
      }, 1000);
      return false;
    });

    $('#back-to-top').tooltip('show');
  }

}