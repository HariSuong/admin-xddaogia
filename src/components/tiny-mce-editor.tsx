import { Editor } from "@tinymce/tinymce-react"

interface TinyMCEEditorProps {
  value: string
  onChange: (content: string) => void
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ value, onChange }) => {
  return (
    <Editor
      apiKey="cyte23ijfl2wvo2qgzv9z1rzz3sv719v041c5c2dyi1ab4r6"
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | link image | formatselect | bold italic backcolor | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | code | help",
        image_title: true,
        /* Chèn hình ảnh dưới dạng base64 */
        images_upload_url: "data:image/jpeg;base64",
        automatic_uploads: false, // Không upload ảnh ngay lập tức
        file_picker_types: "image",
        file_picker_callback: function (callback, value, meta) {
          var input = document.createElement("input")
          input.setAttribute("type", "file")
          input.setAttribute("accept", "image/*")
          input.onchange = function () {
            if (input.files && input.files.length > 0) {
              // Kiểm tra input.files không null và có ít nhất 1 file
              var file = input.files[0]
              var reader = new FileReader()
              reader.onload = function () {
                var base64 = reader.result as string
                callback(base64, { title: file.name })
              }
              reader.readAsDataURL(file)
            } else {
              console.error("Không có file nào được chọn!")
            }
          }
          input.click()
        },
      }}
    />
  )
}

export default TinyMCEEditor
