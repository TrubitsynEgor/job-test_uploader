import axios from 'axios'

export const uploadFileOnDisk = async (
  links: string[],
  formData: FormData[]
) => {
  for (let i = 0; i < links.length; i++) {
    await axios.put(links[i], formData[i])
  }

  console.log('Загрузка завершена')
}
