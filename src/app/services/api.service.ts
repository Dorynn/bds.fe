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
    return this.http.get(`${baseUrl}/projects/allProjects`)
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
    return this.http.get(`${baseUrl}/provinces/withProject`);
  }

  getDistrictHaveProjectByProvinceId(provinceId: any): Observable<any> {
    return this.http.get(`${baseUrl}/provinces/${provinceId}/allDistrictWithProject`)
  }

  getAllDistrictHaveProject(): Observable<any> {
    return this.http.get(`${baseUrl}/districts/withProject`)
  }

  getProvinceByDistrictId(districId: any): Observable<any> {
    return this.http.get(`${baseUrl}/districts/${districId}/getProvinceBy`)
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
    return this.http.put(`${baseUrl}/lands/temporarilyLockOrUnLock`, request)
  }

  getTransactionList(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/transactions`, { headers: { 'Authorization': `Bearer ${this.token}` }, params: params })
  }

  updateTransaction(request: any): Observable<any> {
    return this.http.put(`${baseUrl}/transactions/confirmTransactionSuccessOrFail`, request, { headers: { 'Authorization': `Bearer ${this.token}` } });
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
    return this.http.get(`${baseUrl}/transactions/withUser`, { params: params })
  }

  createUser(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/users/login_user`, request)
  }

  getOtp(request: any): Observable<any> {
    return this.http.post(`${baseUrl}/otp/send-otp`, request)
  }

  verifyOtp(formData: any): Observable<any> {
    return this.http.post(`${baseUrl}/otp/validate`, formData)
  }

  getLandByAreaId(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/lands/allLandByAreaId`, { params: params })
  }

  signUpAdmin(request: any): Observable<any> {
    return this.http.post(`${baseUrlAdmin}/auth/sign_up_admin`, request)
  }

  loginAdmin(request: any): Observable<any> {
    return this.http.post(`${baseUrlAdmin}/auth/sign_in_admin`, request);
  }

  logOutAdmin(request: any): Observable<any> {
    return this.http.post(`${baseUrlAdmin}/auth/logout_admin`, request);
  }

  refreshToken(request: any): Observable<any> {
    return this.http.post(`${baseUrlAdmin}/auth/refresh_token`, request);
  }

  getAdminInf(token: string): Observable<any> {
    return this.http.get(`${baseUrlAdmin}/auth/my_information`, { headers: { 'Authorization': `Bearer ${token}` } })
  }

  deleteTransaction(id: string): Observable<any> {
    return this.http.delete(`${baseUrl}/transactions/${id}`)
  }

  getType(): Observable<any> {
    return this.http.get(`${baseUrl}/project-types`);
  }

  importFile(formData: any): Observable<any> {
    return this.http.post(`${baseUrl}/lands/create_multi_lands_from_excel_file`, formData)
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
