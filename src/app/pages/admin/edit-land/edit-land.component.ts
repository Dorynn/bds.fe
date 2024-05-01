import { Component } from '@angular/core';
import { ActivatedRoute, RouterLinkActive } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
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
  selector: 'app-edit-land',
  templateUrl: './edit-land.component.html',
  styleUrl: './edit-land.component.css'
})
export class EditLandComponent {
  name!: string;
  projectId!: string;
  projectList: any = [];
  landId: string | null = this.route.snapshot.paramMap.get('id');
  areaId!: string;
  areaList: any = [];
  status!: string;
  description: string = '';
  thumbnail: NzUploadFile[] = []
  price!: string;
  deposit!: string;
  acreage!: string;
  address!: string;
  previewVisible: boolean = false;
  previewImage: string | undefined = '';
  loading: boolean = false;
  landDetail: any = [];
  isChangeThumbnail: boolean = false;
  direction: string = '';
  typeOfApartment: string = "";
  projectType: string = "";
  isExistThumbnail: boolean = false;

  constructor(
    private msg: NzMessageService,
    private apiService: ApiService,
    private route: ActivatedRoute,
    private dataService: DataService
  ) {

    this.getLandById();
  }

  ngOnInit(): void {
    this.getAllProjects();
  }

  getAllProjects() {
    this.apiService.getAllProject().subscribe({
      next: (res: any) => {
        this.projectList = res.data;
      }
    })
  }

  handleChange(info: { file: NzUploadFile }): void {
    this.isChangeThumbnail = true;

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
      case 'removed':
        this.thumbnail = [];
        break;
    }

    console.log(this.thumbnail);

  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  }

  getAreaByProjectId() {
    this.apiService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.areaList = res.data.areas
      }
    })
  }

  getLandById() {
    this.thumbnail = []
    this.apiService.getLandById(this.landId).subscribe({
      next: (res: any) => {
        this.landDetail = res.data;
        this.acreage = res.data.acreage;
        this.address = res.data.address;
        this.areaId = res.data.areaDTO.id;
        this.projectId = res.data.areaDTO.projectId;
        this.deposit = res.data.deposit;
        this.price = res.data.price;
        this.description = res.data.description;
        this.name = res.data.name;
        this.status = res.data.status
        this.typeOfApartment = res.data.typeOfApartment;
        this.direction = res.data.direction

        if (res.data.thumbnail) {
          this.isExistThumbnail = true;
          this.thumbnail.push({
            url: res.data.thumbnail,
            uid: '-1',
            name: 'image.png',
            status: 'done'
          })
        }

        if (!this.thumbnail) {
          this.thumbnail = [];
        }
        this.getAreaByProjectId();
        this.getProjectById();

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
    this.getAreaByProjectId();
  }

  handleEditLand() {
    this.dataService.changeStatusLoadingAdmin(true);
    let formData = new FormData();
    formData.append("id", String(this.landId))
    formData.append("name", this.name);
    formData.append("description", this.description);
    if (this.isChangeThumbnail) {
      formData.append("thumbnail", this.thumbnail[0].originFileObj!);
    }
    formData.append("address", this.address);
    formData.append("status", this.status);
    formData.append("price", this.price);
    formData.append("deposit", this.deposit);
    formData.append("acreage", this.acreage);
    formData.append("areaId", this.areaId);
    formData.append("typeOfApartment", this.typeOfApartment);
    formData.append("direction", this.direction);
    this.apiService.updateLand(formData).subscribe({
      next: (res: any) => {
        this.dataService.changeStatusLoadingAdmin(false);
        this.msg.success("Cập nhật khu đất thành công!");
      },
      error: (err: any) => {
        this.dataService.changeStatusLoadingAdmin(false);
        this.msg.error("Cập nhật khu đất thất bại!");
      }
    })
  }

}
