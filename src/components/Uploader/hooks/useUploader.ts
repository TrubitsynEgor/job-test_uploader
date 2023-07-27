import { useState, DragEvent, useEffect } from 'react'
import { uploadFileOnDisk } from '../../../service/uploadFileOnDisk'
import { getUploadLink } from '../../../service/getUploadLink'

export const useUploader = () => {
  // Объявляем все необходимые состояния ===>
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

  // Смена флага для drag для смены отображаемой области ===>
  const dragStartHandler = (e: DragEvent<HTMLSpanElement>) => {
    e.preventDefault()
    setDrag(true)
  }
  // Смена флага для drag для смены отображаемой области ===>
  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDrag(false)
  }

  // Основной handler для получения, преобразования файлов и сохранения их в состояние,
  // так же отображение первого элемента на preview ===>
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

  // Отправляем файлы на ya-disk
  const sendFiles = async () => {
    if (!linkResponse.length) return
    setLoader(true)
    await uploadFileOnDisk(linkResponse, formDataArray)
    setLoader(false)
    setAlert(true)
    setFilePreview(null)
    setDrag(false)
  }

  // Получаем линки для загрузки файлов, при каждом изменении массива files
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
      .catch(() => {
        setError(true)
        setFilePreview(null)
        setLoader(false)
      })
  }, [files])

  // Простой переключатель для смены отображения алертов
  useEffect(() => {
    setInterval(() => {
      setAlert(false)
      setError(false)
      setLengthError(false)
    }, 10000)
  }, [alert])

  return {
    drag,
    filePreview,
    loader,
    alert,
    error,
    lengthError,
    dragStartHandler,
    dragLeaveHandler,
    onDropHandler,
    sendFiles,
    files,
  }
}
