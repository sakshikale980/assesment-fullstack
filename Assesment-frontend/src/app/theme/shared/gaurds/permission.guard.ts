import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionManagementService } from 'src/app/modules/layout/permission-management/services/permission-management.service';
import { permissions } from 'src/app/shared/constant/permission.constant';
import { Menu } from '../constants/menu';
import { MenuItem, SubMenuItem } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  permissions = permissions;
  permissionValue: any;
  constructor(
    private permissionService: PermissionManagementService,
    private router: Router,
  ) { }
  menuItemList: MenuItem[] = [];
  canActivate(
    _route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve) => {
      this.menuItemList = Menu.pages[0].items as any;
      let activeMenu: any;
      this.permissionService.permissions.subscribe((data: any) => {
        if (data) {
          this.permissionValue = data;
          this.menuItemList.forEach((eachMenu: any) => {
            if (eachMenu.routerLink == state.url) {
              activeMenu = eachMenu;
            } else {
              if (eachMenu?.children?.length > 0) {
                eachMenu.children.forEach((eachSubmenu: any) => {
                  if (eachSubmenu.routerLink == state.url) {
                    activeMenu = eachSubmenu;
                  }
                });
              }
            }
          });
        }
      });
      if (activeMenu) {
        if (this.permissionValue[permissions[activeMenu?.checkPermission].id]) {
          resolve(true);
        } else {
          resolve(false);
          this.router.navigate(['/permission-denied']);
        }
      } else {
        resolve(true);
        // this.router.navigate(['/permission-denied']);
      }
    });
  }
}
