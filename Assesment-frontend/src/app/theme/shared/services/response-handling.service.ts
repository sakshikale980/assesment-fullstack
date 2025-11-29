import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs/internal/observable/throwError';
import { HttpStatusCode } from '../model/response.models';

@Injectable({
    providedIn: 'root',
})
export class ResponseHandlingService {
    public errorMessage: string = '';

    constructor(private router: Router) { }

    showError(errorMessage: string, timeOut?: number,
        title?: string, sticky: boolean = false) {
        this.showMessage(errorMessage, 'error', title || 'Error', timeOut, sticky);
    }

    showSuccess(successMessage: string, timeOut?: number,
        title?: string, sticky: boolean = false) {
        this.showMessage(successMessage, 'success', title || 'Success', timeOut, sticky);
    }

    showWarning(warnMessage: string, timeOut?: number, title?: string, sticky: boolean = false) {
        this.showMessage(warnMessage, 'warn', title || 'Warning', timeOut, sticky);
    }

    showInfo(infoMessage: string, timeOut?: number, title?: string,
        sticky: boolean = false) {
        this.showMessage(infoMessage, 'info', title || 'Information', timeOut, sticky);
    }

    showMessage(message: string, severity: string,
        title: string, timeOut?: number, sticky?: boolean) {
        // this.messageService.clear();
        // this.messageService.add({ severity: severity, summary: title, detail: message });
        // this.toastr.add({
        //     summary: title,
        //     severity: severity,
        //     detail: message,
        //     life: timeOut ? timeOut : 3000,
        //     sticky: sticky,
        // });
    }

    handleError(error: any, errorCodeMapping?: Map<HttpStatusCode, string>,
        redirect: boolean = true, excludedCodes: HttpStatusCode[] = []) {
        //Lets hide the spinner in case of error spinner not handled.
        // this.loadingService.hide();
        let errorMessage = error.message;

        //dont handle if explicitely asked to be excluded (requestor would handle it)
        if (error.status && excludedCodes.find((st) => st == error.status))
            return throwError(() => new Error(errorMessage));

        if (errorCodeMapping && errorCodeMapping.has(error.status) && !redirect) {
            let err = errorCodeMapping.get(error.status);
            errorMessage = err ? `Error: ${err}` : 'Unable to determine error';
            if (error.status != 400) {
                let errMsg = (error.error && error.error.message) || errorMessage;
                this.showError(errMsg);
            }
            return throwError(() => new Error(errorMessage));
        }

        if (error.status === HttpStatusCode.UNAUTHORIZED) {
            //TODO: Please add the Unautorized page
            this.router.navigate(['unauthorized']);
            return throwError(() => new Error(errorMessage));;
        }

        //TODO:  Call ErrorLogAPI, POST api/Log/LogUIError
        // this.logService.LogUIError(error).subscribe((res)=>{
        //     console.log(res);
        // });
        if (error.status != 400) {
            let errMsg = (error.error && error.error.message) || errorMessage;
            this.showError(errMsg);
        }

        // bad request
        if (error.status === 400) {
            this.handleOtherError(error);
        }

        return throwError(() => new Error(errorMessage));
    }

    private handleOtherError = (error: HttpErrorResponse) => {
        this.createErrorMessage(error);
    };

    private createErrorMessage = (error: HttpErrorResponse) => {
        this.errorMessage = error.error ? error.error : error.statusText;
    };
}
