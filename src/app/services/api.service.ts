import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from '../../environments/environment';

const baseUrl = 'http://localhost:8686/api/v1';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  getProjectList(request: any):Observable<any>{
    return this.http.get('http://localhost:8686/api/v1/projects',{params: request});
  }

  getAllProject():Observable<any>{
    return this.http.get(`${baseUrl}/projects/allProjects`)
  }

  addProject(request: any):Observable<any>{
    return this.http.post(`${baseUrl}/projects`,request);
  }

  getProjectById(id: string | null):Observable<any> {
    return this.http.get(`${baseUrl}/projects/${id}`)
  }
  
  getAreaById(id: string | null):Observable<any> {
    return this.http.get(`${baseUrl}/areas/${id}`)
  }

  getAllProvince():Observable<any> {
    return this.http.get(`${baseUrl}/provinces`);
  }

  getDistrictByProvinceId(provinceId: any):Observable<any> {
    return this.http.get(`${baseUrl}/provinces/${provinceId}`)
  }

  getProvincesHaveProject():Observable<any> {
    return this.http.get(`${baseUrl}/provinces/withProject`);
  }

  getDistrictHaveProjectByProvinceId(provinceId: any):Observable<any> {
    return this.http.get(`${baseUrl}/provinces/${provinceId}/allDistrictWithProject`)
  }

  getAllDistrictHaveProject():Observable<any> {
    return this.http.get(`${baseUrl}/districts/withProject`)
  }

  getProvinceByDistrictId(districId: any):Observable<any> {
    return this.http.get(`${baseUrl}/districts/${districId}/getProvinceBy`)
  }

  createProject(request: any):Observable<any>{
    return this.http.post(`${baseUrl}/projects`,request);
  }

  updateProject(request: any):Observable<any>{
    return this.http.put(`${baseUrl}/projects`,request)
  }

  getAreaList(request:any):Observable<any> {
    return this.http.get(`${baseUrl}/areas`,{params: request});
  }

  createArea(request: any):Observable<any> {
    return this.http.post(`${baseUrl}/areas`, request);
  }

  updateArea(request: any):Observable<any> {
    return this.http.put(`${baseUrl}/areas`, request)
  }

  getLandList(request: any):Observable<any> {
    return this.http.get(`${baseUrl}/lands`, {params: request})
  }

  createLand(request: any):Observable<any> {
    return this.http.post(`${baseUrl}/lands`,request)
  }

  updateLand(request: any):Observable<any> {
    return this.http.put(`${baseUrl}/lands`,request)
  }

  getLandById(id: string | null):Observable<any> {
    return this.http.get(`${baseUrl}/lands/${id}`)
  }

  updateLandStatus(request: any):Observable<any>{
    return this.http.put(`${baseUrl}/lands/temporarilyLockOrUnLock`,request)
  }

  getTransactionList(params: any):Observable<any> {
    return this.http.get(`${baseUrl}/transactions`, {params: params})
  }

  updateTransaction(request: any):Observable<any> {
    return this.http.put(`${baseUrl}/transactions/confirmTransactionSuccessOrFail`,request);
  }

  getTransactionById(id: string | null):Observable<any> {
    return this.http.get(`${baseUrl}/transactions/${id}`);
  }

  getUserList(params:any):Observable<any>{
    return this.http.get(`${baseUrl}/users`, {params: params})
  }

  createTransaction(request:any):Observable<any>{
    return this.http.post(`${baseUrl}/transactions`, request)
  }

  getTransactionOfUser(params: any):Observable<any>{
    return this.http.get(`${baseUrl}/transactions/withUser`, {params: params})
  }

  createUser(request: any):Observable<any> {
    return this.http.post(`${baseUrl}/users/login_user`,request)
  }

  getOtp(request: any):Observable<any>{
    return this.http.post(`${baseUrl}/otp/send-otp`, request)
  }

  verifyOtp(formData: any):Observable<any>{
    return this.http.post(`${baseUrl}/otp/validate`,formData)
  }
}
