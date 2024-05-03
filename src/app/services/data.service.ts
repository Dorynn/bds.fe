import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private statusLoginModal = new BehaviorSubject(false);
  private statusRegisterModal = new BehaviorSubject(false);
  private statusRegisterModalStep2 = new BehaviorSubject(false);
  private statusLandDetailModal = new BehaviorSubject(false);
  private statusPaymentModal = new BehaviorSubject(false);
  private statusVerifyPhoneNumber = new BehaviorSubject(false);
  private statusLoadingAdmin = new BehaviorSubject(false);
  private statusLoadingUser = new BehaviorSubject(false);
  private statusProjectInformationModal = new BehaviorSubject(false);
  private roleUser = new BehaviorSubject('USER');
  private adminInf = new BehaviorSubject({});
  isVisibleLoginModal = this.statusLoginModal.asObservable();
  isVisibleRegisterModal = this.statusRegisterModal.asObservable();
  isVisibleRegisterModalStep2 = this.statusRegisterModalStep2.asObservable()
  isVisibleLandDetailModal = this.statusLandDetailModal.asObservable();
  isVisiblePaymentModal = this.statusPaymentModal.asObservable()
  isVisibleVerifyPhoneNumber = this.statusVerifyPhoneNumber.asObservable();
  isUser = this.roleUser.asObservable();
  isLoadingAdmin = this.statusLoadingAdmin.asObservable();
  isLoadingUser = this.statusLoadingUser.asObservable();
  admin = this.adminInf.asObservable();
  isProjectInformationModal = this.statusProjectInformationModal.asObservable();

  constructor() { }

  changeStatusLoginModal (status: boolean) {
    this.statusLoginModal.next(status);
  }

  changeStatusRegisterModal (status: boolean) {
    this.statusRegisterModal.next(status);
  }

  changeStatusRegisterModalStep2 (status: boolean) {
    this.statusRegisterModalStep2.next(status);
  }

  changeStatusLandDetailModal (status: boolean) {
    this.statusLandDetailModal.next(status);
  }

  changeStatusPaymentModal (status: boolean) {
    this.statusPaymentModal.next(status);
  }

  changeStatusVerifyPhoneNumberModal (status: boolean) {
    this.statusVerifyPhoneNumber.next(status)
  }

  setRole(role: string){
    this.roleUser.next(role);
  }

  changeStatusLoadingAdmin (status: boolean) {
    this.statusLoadingAdmin.next(status);
  }

  changeStatusLoadingUser (status: boolean) {
    this.statusLoadingUser.next(status);
  }

  setAdminInf(inf: any) {
    this.adminInf.next(inf);
  }

  changeStatusProjectInformationModal(status: boolean) {
    this.statusProjectInformationModal.next(status);
  }

}
