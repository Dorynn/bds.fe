import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit {
  name!: string;
  type!: string;
  status!: string;
  thumbnail: NzUploadFile[] = [
    {
      uid: '-1',
      name: 'image.png',
      url: 'https://storage.googleapis.com/vinhomes-data-02/styles/images_870_x_530/public/2023_07/gDEHQfH0_1689751750.jpeg?itok=R6lbOml4'
    }
  ];
  description!: string;
  district!: string;
  address!: string;
  investor!: string;
  bankHost!: string;
  bankNumber!: string;
  bankName!: string;
  qrImage: NzUploadFile[]=[
    {
      uid: '-1',
      name: 'image.png',
      url: 'https://res.cloudinary.com/dh2jzuhav/image/upload/v1714054752/ATP_BDS/cfqicbiqfapaovdnb9jr.jpg'
    }
  ];
  investorPhoneNumber!: string;
  startDate!: Date;
  endDate!: Date;
  stompClient: any;
  provinceId: any;
  provinceList: any = [];
  districtList: any = [];
  projectId: string | null = this.route.snapshot.paramMap.get('id');
  projectDetail: any = [];
  previewVisible: boolean = false;
  previewImage: string | undefined = '';
  isChangeThumbnail: boolean = false;
  isChangeQrImg: boolean = false;
  loading:boolean = true;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private msg: NzMessageService,
    private dataService: DataService
  ){}

  ngOnInit(): void {
    this.getProjectById();
    this.getProvinceList();
  }
  
  getProjectById() {
    return this.apiService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.projectDetail = res.data;
        this.name = res.data.name;
        this.type = res.data.projectType.id;
        this.address = res.data.address;
        this.bankHost = res.data.hostBank;
        this.bankName = res.data.bankName;
        this.bankNumber = res.data.bankNumber;
        this.investor = res.data.investor;
        this.investorPhoneNumber = res.data.investorPhone;
        this.district = res.data.district.id;
        this.description = res.data.description;
        this.provinceId = res.data.district.provinceId
        this.status = res.data.status;
        this.endDate = new Date(res.data.endDate);
        this.startDate = new Date(res.data.startDate);
        this.thumbnail[0].url = res.data.thumbnail;
        this.qrImage[0].url = res.data.qrImg;
        this.getDistrictByProvince();
      }
    })
  }  

  editProject(){
  this.dataService.changeStatusLoadingAdmin(true);
    const formData = new FormData();
    let id: string = String(this.projectId);
    formData.append("id", id)
    formData.append("name", this.name)
    formData.append("description", this.description)
    formData.append("status", this.status)
    formData.append("address", this.address)
    formData.append("startDate", this.startDate.toISOString().substring(0,10))
    formData.append("endDate", this.endDate.toISOString().substring(0,10))
    formData.append("bankNumber", this.bankNumber)
    formData.append("bankName", this.bankName)
    formData.append("hostBank", this.bankHost)
    formData.append("investor", this.investor)
    formData.append("investorPhone", this.investorPhoneNumber)
    formData.append("projectTypeId", this.type)
    formData.append("districtId", this.district)
    formData.append("thumbnail", this.thumbnail[0].originFileObj!)
    formData.append("qrImg", this.qrImage[0].originFileObj!)
    if (this.isChangeThumbnail) {
    }
    if (this.isChangeQrImg){
    }

    this.apiService.updateProject(formData).subscribe({
      next: (res: any) => {
        this.msg.success("Cập nhật dự án thành công!");
        this.dataService.changeStatusLoadingAdmin(false);
      },
      error: (err:any) => {
        this.msg.error("Cập nhật giao dịch thất bại")
        this.dataService.changeStatusLoadingAdmin(false);
      }
    })
  }

  onFileSelected(event: any) {
    this.thumbnail = event.target.files?.[0]
    this.isChangeThumbnail = true;
  }

  onFile2Selected(event: any) {
    this.qrImage = event.target.files?.[0]
    this.isChangeQrImg = true;
    
  }

  getProvinceList(): void {
    this.apiService.getAllProvince().subscribe({
      next: (res: any) => {
        this.provinceList = res.data;
      }
    })
  }

  getDistrictByProvince(): void {
    this.apiService.getDistrictByProvinceId(this.provinceId).subscribe({
      next: (res: any) => {
        this.districtList = res.data
      }
    })
  }

  onChangeProvince() {
    this.getDistrictByProvince();
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
}

