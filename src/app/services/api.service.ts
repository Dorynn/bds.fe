import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from '../../environments/environment';

const baseUrl = 'http://localhost:8686/api/v1';
const baseUrlAdmin = 'http://localhost:8686';

type NewType = Observable<any>;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token: string | null = ''
  constructor(
    private http: HttpClient
  ) {
    this.token = localStorage.getItem("token");
    console.log(this.token)
  }

  getProjectList(request: any): Observable<any> {
    return this.http.get('http://localhost:8686/api/v1/projects', { params: request });
  }

  getAllProject(): Observable<any> {
    return this.http.get(`${baseUrl}/projects/all-projects`)
  }

  addProject(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/projects`, request, { headers: { 'Authorization': `Bearer ${this.token}` } });
  }

  getProjectById(id: string | null): Observable<any> {
    return this.http.get(`${baseUrl}/projects/${id}`)
  }

  getAreaById(id: string | null): Observable<any> {
    return this.http.get(`${baseUrl}/areas/${id}`)
  }

  getAllProvince(): Observable<any> {
    return this.http.get(`${baseUrl}/provinces`);
  }

  getDistrictByProvinceId(provinceId: any): Observable<any> {
    return this.http.get(`${baseUrl}/provinces/${provinceId}`)
  }

  getProvincesHaveProject(): Observable<any> {
    return this.http.get(`${baseUrl}/provinces/with-project`);
  }

  getDistrictHaveProjectByProvinceId(provinceId: any): Observable<any> {
    return this.http.get(`${baseUrl}/provinces/${provinceId}/all-district-with-project`)
  }

  getAllDistrictHaveProject(): Observable<any> {
    return this.http.get(`${baseUrl}/districts/with-project`)
  }

  getProvinceByDistrictId(districId: any): Observable<any> {
    return this.http.get(`${baseUrl}/districts/${districId}/get-province`)
  }

  createProject(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/projects`, request, { headers: { 'Authorization': `Bearer ${this.token}` } });
  }

  updateProject(request: any): Observable<any> {
    return this.http.put(`${baseUrl}/projects`, request, { headers: { 'Authorization': `Bearer ${this.token}` } })
  }

  getAreaList(request: any): Observable<any> {
    return this.http.get(`${baseUrl}/areas`, { params: request });
  }

  createArea(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/areas`, request, { headers: { 'Authorization': `Bearer ${this.token}` } });
  }

  updateArea(request: any): Observable<any> {
    return this.http.put(`${baseUrl}/areas`, request, { headers: { 'Authorization': `Bearer ${this.token}` } })
  }

  getLandList(request: any): Observable<any> {
    return this.http.get(`${baseUrl}/lands`, { params: request })
  }

  createLand(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/lands`, request, { headers: { 'Authorization': `Bearer ${this.token}` } })
  }

  updateLand(request: any): Observable<any> {
    return this.http.put(`${baseUrl}/lands`, request, { headers: { 'Authorization': `Bearer ${this.token}` } })
  }

  getLandById(id: string | null): Observable<any> {
    return this.http.get(`${baseUrl}/lands/${id}`)
  }

  updateLandStatus(request: any): Observable<any> {
    return this.http.put(`${baseUrl}/lands/temporarily-lock-or-unlock`, request)
  }

  getTransactionList(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/transactions`, { headers: { 'Authorization': `Bearer ${this.token}` }, params: params })
  }

  updateTransaction(request: any): Observable<any> {
    return this.http.put(`${baseUrl}/transactions/confirm-transaction-success-or-fail`, request, { headers: { 'Authorization': `Bearer ${this.token}` } });
  }

  getTransactionById(id: string | null): Observable<any> {
    return this.http.get(`${baseUrl}/transactions/${id}`);
  }

  getUserList(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/users`, { params: params })
  }

  createTransaction(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/transactions`, request)
  }

  getTransactionOfUser(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/transactions/with-user`, { params: params })
  }

  createUser(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/users/login-user`, request)
  }

  getOtp(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/otp/send-otp`, request)
  }

  verifyOtp(formData: any): Observable<any> {
    return this.http.post(`${baseUrl}/otp/validate`, formData)
  }

  getLandByAreaId(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/lands/all-land-by-area-id`, { params: params })
  }

  signUpAdmin(request: any): Observable<any> {
    return this.http.post(`${baseUrlAdmin}/auth/sign-up-admin`, request)
  }

  loginAdmin(request: any): Observable<any> {
    return this.http.post(`${baseUrlAdmin}/auth/sign-in-admin`, request);
  }

  logOutAdmin(request: any): Observable<any> {
    return this.http.post(`${baseUrlAdmin}/auth/logout-admin`, request);
  }

  refreshToken(request: any): Observable<any> {
    return this.http.post(`${baseUrlAdmin}/auth/refresh-token`, request);
  }

  getAdminInf(token: string): Observable<any> {
    return this.http.get(`${baseUrlAdmin}/auth/my-information`, { headers: { 'Authorization': `Bearer ${token}` } })
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/transactions/${id}`)
  }

  getType(): Observable<any> {
    return this.http.get(`${baseUrl}/project-types`);
  }

  importFile(formData: any): Observable<any> {
    return this.http.post(`${baseUrl}/lands/create-multi-lands-from-excel-file`, formData)
  }

  getAllTypeOfApartment(): Observable<any> {
    return this.http.get(`${baseUrl}/lands/all-type-of-apartment`)
  }

  getAllDirection(): Observable<any> {
    return this.http.get(`${baseUrl}/lands/all-direction`)
  }

  filterLandByProjectId(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/lands/all-lands-by-project-id`, { params: params });
  }
}
