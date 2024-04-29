import { Component, OnInit } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message'
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-add-land',
  templateUrl: './add-land.component.html',
  styleUrl: './add-land.component.css'
})
export class AddLandComponent implements OnInit {
  name!: string;
  description!: string;
  thumbnail: NzUploadFile[] = [];
  address!: string;
  status!: string;
  price!: string;
  deposit!: string;
  acreage!: string;
  areaId!: string;
  previewVisible: boolean = false;
  previewImage: string | undefined = '';
  loading: boolean = false;
  projectList: any = [];
  areaList: any = [];
  projectId: string = '';
  isProjectChange: boolean = false;
  projectType: string = '';
  typeOfApartment: string = '';
  direction: string = '';
  isMoreInf: boolean = false;

  constructor(
    private msg: NzMessageService,
    private apiService: ApiService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getAllProjects();
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  }

  handleChange(info: { file: NzUploadFile }): void {
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        this.handlePreview(info.file);
        this.loading = false;
        break;
      case 'error':
        this.loading = false;
        break;
    }
  }

  getAllProjects() {
    this.apiService.getAllProject().subscribe({
      next: (res: any) => {
        this.projectList = res.data;
      }
    })
  }

  getAreaByProjectId() {
    this.apiService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.areaList = res.data.areas
      }
    })
  }

  getProjectById() {
    this.apiService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.projectType = res.data.projectType.id;
      }
    })
  }

  handleChangeProject() {
    this.isProjectChange = true;
    this.getAreaByProjectId();
    this.getProjectById();
    this.isMoreInf = true;
  }

  handleAddLand() {
    this.dataService.changeStatusLoadingAdmin(true);
    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("description", this.description);
    formData.append("thumbnail", this.thumbnail[0].originFileObj!);
    formData.append("address", this.address);
    formData.append("status", this.status);
    formData.append("price", this.price);
    formData.append("deposit", this.deposit);
    formData.append("acreage", this.acreage);
    formData.append("areaId", this.areaId);
    formData.append("typeOfApartment", this.typeOfApartment);
    formData.append("direction", this.direction)
    this.apiService.createLand(formData).subscribe({
      next: (res: any) => {
        this.msg.success('Thêm mới khu đất thành công!')
        this.name = '';
        this.description = '';
        this.thumbnail = [];
        this.acreage = '';
        this.address = '';
        this.status = '';
        this.price = '';
        this.deposit = '';
        this.areaId = '';
        this.isProjectChange = false;
        this.projectId = '';
        this.typeOfApartment="";
        this.direction = "";
        this.dataService.changeStatusLoadingAdmin(false);
      },
      error:(err: any) => {
        this.dataService.changeStatusLoadingAdmin(false);
        this.msg.error(`Tạo mới khu đất thất bại, lỗi ${err}`)
      }
    })
  }
}



