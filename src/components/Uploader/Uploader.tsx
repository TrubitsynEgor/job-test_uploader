import { DetailsDivProps } from '../../types'
import { FC, useState, DragEvent, useEffect } from 'react'
import styles from './Uploader.module.scss'
import cn from 'classnames'
import { Button } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { getUploadLink } from '../../service/getUploadLink'
import { uploadFileOnDisk } from '../../service/uploadFileOnDisk'

export const Uploader: FC<DetailsDivProps> = ({ className }) => {
  const [drag, setDrag] = useState(false)
  const [formDataArray, setFormDataArray] = useState<FormData[]>([])
  const [linkResponse, setLinkResponse] = useState<string[]>([])
  const [filePreview, setFilePreview] = useState<string | ArrayBuffer | null>(
    null
  )
  const [files, setFiles] = useState<File[]>([])
  const [loader, setLoader] = useState(false)
  const [alert, setAlert] = useState(false)
  const [error, setError] = useState(false)
  const [lengthError, setLengthError] = useState(false)

  const dragStartHandler = (e: DragEvent<HTMLSpanElement>) => {
    e.preventDefault()
    setDrag(true)
  }

  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDrag(false)
  }
  const onDropHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const uploadedFiles = [...e.dataTransfer.files]
    if (uploadedFiles.length > 100) {
      setLengthError(true)
      return
    }
    setFiles(uploadedFiles)

    const array: FormData[] = []
    uploadedFiles.forEach((el) => {
      const formData = new FormData()
      formData.append('file', el)
      array.push(formData)
    })
    setFormDataArray(array)

    const reader = new FileReader()
    reader.onloadend = () => {
      setFilePreview(reader.result)
    }
    reader.readAsDataURL(e.dataTransfer.files[0])
  }

  const sendFiles = async () => {
    setLoader(true)
    await uploadFileOnDisk(linkResponse, formDataArray)
    setLoader(false)
    setAlert(true)
  }

  useEffect(() => {
    setLoader(true)
    const fetchLinks = async () => {
      const linksArray: string[] = []
      for (let i = 0; i < files.length; i++) {
        const data = await getUploadLink(files[i].name)
        linksArray.push(data.href)
      }
      setLinkResponse(linksArray)
      setLoader(false)
    }

    fetchLinks()
      .then(() => console.log('Загрузка ссылок завершена'))
      .catch(() => setError(true))
  }, [files])

  useEffect(() => {
    setInterval(() => {
      setAlert(false)
      setError(false)
      setLengthError(false)
    }, 15000)
  }, [alert])

  return (
    <div className={cn(styles.uploader, className)}>
      {alert && (
        <div className={styles.alert}>
          Файлы успешно загружены на yandex-disk!
        </div>
      )}
      {error && (
        <div className={cn(styles.alert, styles.error)}>
          Данные изображения уже присутствуют на yandex-disk!
        </div>
      )}

      {lengthError && (
        <div className={cn(styles.alert, styles.error)}>
          Вы не можите загрузить больше чем 100 файлов за один раз!
        </div>
      )}
      {loader && <div className={styles.loader}>Loading...</div>}
      {!drag ? (
        <div
          onDragStart={(e) => dragStartHandler(e)}
          onDragLeave={(e) => dragLeaveHandler(e)}
          onDragOver={(e) => dragStartHandler(e)}
          className={styles.area}
        >
          Переместите файл сюда
        </div>
      ) : (
        <div
          onDragStart={(e) => dragStartHandler(e)}
          onDragLeave={(e) => dragLeaveHandler(e)}
          onDragOver={(e) => dragStartHandler(e)}
          onDrop={(e) => onDropHandler(e)}
          className={cn(styles.area, styles.final)}
        >
          {filePreview !== null && (
            <img
              className={styles.preview}
              src={filePreview.toString()}
              alt=""
            />
          )}
        </div>
      )}

      <div className={styles.btnGroup}>
        <Button
          className={styles.btn}
          type="primary"
          icon={<DownloadOutlined />}
          size={'large'}
        >
          Загрузить
        </Button>

        <Button
          className={styles.btn}
          onClick={sendFiles}
          type="primary"
          size={'large'}
        >
          Отправить
        </Button>
      </div>
    </div>
  )
}
