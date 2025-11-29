import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }
    private can: boolean = false;

    setCanActivate(can: any) {
        this.can = can;
    }

    canActivate() {
        if (localStorage.getItem('atUserLogin')) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;
    }
}
