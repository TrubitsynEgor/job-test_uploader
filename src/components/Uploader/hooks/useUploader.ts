import { useState, DragEvent, useEffect } from 'react'
import { uploadFileOnDisk } from '../../../service/uploadFileOnDisk'
import { getUploadLink } from '../../../service/getUploadLink'

export const useUploader = () => {
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
    setFilePreview(null)
    setDrag(false)
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
      .catch(() => {
        setError(true)
        setFilePreview(null)
        setLoader(false)
      })
  }, [files])

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
  }
}
