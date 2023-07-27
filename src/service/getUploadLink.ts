import axios from 'axios'
import { LinkResponse } from '../types/axios'

export const getUploadLink = async (name: string) => {
  const { data } = await axios.get<LinkResponse>(
    `https://cloud-api.yandex.net/v1/disk/resources/upload?path=%2FuploadTest%2F${name}`,
    {
      headers: {
        Authorization:
          'y0_AgAAAABn0tMjAAo-fAAAAADox6AofmcqKLBgT8aWDvxeeRGiqoNCaMg',
      },
    }
  )

  return data
}
