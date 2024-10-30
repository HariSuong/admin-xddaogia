// Type cho File Upload
export interface UploadFile {
  lastModified: number
  lastModifiedDate: Date
  name: string
  size: number
  type: string
  uid: string
  originFileObj: File
  thumbUrl?: string
}

// Type cho Dữ liệu Post Insert
export interface PostInsert {
  title: string
  desc: string
  content: string
  show: boolean
  hot: boolean
  priority: string
  menus: number // Mảng các danh mục (dưới dạng slug hoặc id)
  keywords: string // Chuỗi từ khóa, có thể là một string phân tách bởi dấu phẩy
  thumb: File // Mảng chứa file hình ảnh (vì bạn đang gửi nhiều file)
}

/**
 * // Example dữ liệu bạn gửi cho request insert
const postData: PostInsert = {
  title: "Test",
  desc: "This is test",
  content: "<h3>Nội dung văn bản</h3><h3>Những thứ thiết lập nên văng bản</h3><p>Đầu tiên phải kể đến a, b, c</p>",
  show: true,
  hot: false,
  priority: "1",
  menus: ["mau-nha-dep", "mau-nha-4-tang"],
  keywords: "một, hai",
  thumb: [
    {
      lastModified: 1726459134370,
      lastModifiedDate: new Date("2024-09-16T03:58:54.000Z"),
      name: "458343767_1590637291515352_1197812350055542534_n.jpg",
      size: 105038,
      type: "image/jpeg",
      uid: "rc-upload-1726888757763-3",
      originFileObj: new File([""], "458343767_1590637291515352_1197812350055542534_n.jpg"),
    },
  ],
};
 * 
 */
