import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ApiService } from '../../../services/api.service';
import { DataService } from '../../../services/data.service';
import { SocketService } from '../../../services/socket.service';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent implements OnInit {
  name!: string;
  type!: string;
  status!: string;
  thumbnail!: File | string;
  description!: string;
  district!: string;
  address!: string;
  investor!: string;
  bankHost!: string;
  bankNumber!: string;
  bankName!: string;
  qrImage!: File | string;
  investorPhoneNumber!: string;
  startDate!: Date;
  endDate!: Date;
  stompClient: any;
  provinceId: any;
  provinceList: any = [];
  districtList: any = [];
  isDisableDistrictSelection: boolean = true;
  previewVisible: boolean = false;
  previewImage: string | undefined = '';
  fileImage: any[] = [];
  fileQr: any[] = [];
  loading: boolean = false;
  typeList: any = [];
  filterTypeOptions: string[] = [];
  defaultDeposit: string = '';
  expiryDate: string = '';

  constructor(
    private apiService: ApiService,
    private socketService: SocketService,
    private msg: NzMessageService,
    private dataService: DataService
  ) {
    this.stompClient = this.socketService.connect();
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/topic/add_project', (message: any) => {
        this.getProjects();
      })
    })
  }

  ngOnInit(): void {
    this.getProjects();
    this.getProvinceList();
    this.getTypeList();
  }

  addProject() {
    this.dataService.changeStatusLoadingAdmin(true)
    const formData = new FormData();
    formData.append("name", this.name)
    formData.append("description", this.description)
    formData.append("thumbnail", this.fileImage[0].originFileObj!)
    formData.append("status", this.status)
    formData.append("address", this.address)
    formData.append("startDate", this.startDate.toISOString().substring(0, 10))
    formData.append("endDate", this.endDate.toISOString().substring(0, 10))
    formData.append("qrImg", this.fileQr[0].originFileObj!)
    formData.append("bankNumber", this.bankNumber)
    formData.append("bankName", this.bankName)
    formData.append("hostBank", this.bankHost)
    formData.append("investor", this.investor)
    formData.append("investorPhone", this.investorPhoneNumber)
    formData.append("projectType", this.type)
    formData.append("districtId", this.district)
    formData.append("defaultDeposit", this.defaultDeposit);
    formData.append("expiryDate", this.expiryDate)
    this.apiService.addProject(formData).subscribe({
      next: (res: any) => {
        this.name = '';
        this.type = '';
        this.status = '';
        this.description = '';
        this.district = '';
        this.address = '';
        this.investor = '';
        this.bankHost = '';
        this.bankNumber = '';
        this.bankName = '';
        this.investorPhoneNumber = '';
        this.fileImage = [];
        this.fileQr = [];
        this.provinceId = '';
        this.startDate = new Date();
        this.endDate = new Date();
        this.expiryDate = '';
        this.defaultDeposit = '';
        this.stompClient.send("/app/projects", {}, JSON.stringify(formData));
        this.msg.success("Thêm mới dự án thành công!");
        this.dataService.changeStatusLoadingAdmin(false);
      },
      error: (res: any) => {
        this.dataService.changeStatusLoadingAdmin(false);
        this.msg.error("Thêm mới dự án thất bại!")
      }
    })
  }

  getTypeList() {
    this.apiService.getType().subscribe({
      next: (res: any) => {
        res.data.map((e: any) => {
          this.typeList.push(e.name)
          this.filterTypeOptions = this.typeList
        })
      }
    })
  }

  onChangeType(value: string):void {
    console.log('logo')
    this.filterTypeOptions = this.typeList.filter((option: string) => option.toLowerCase().indexOf(value.toLowerCase())!== -1)
  }

  getProjects() {
    this.apiService.getProjectList({ pageIndex: 0, pageSize: 20 }).subscribe({
      next: (res: any) => {
      }
    })
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
    this.isDisableDistrictSelection = false;
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  }

  handleChange(info: { file: NzUploadFile }): void {
    this.thumbnail = this.fileImage[0].originFileObj!;
    this.qrImage = this.fileQr[0]

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
