import { DetailsDivProps } from '../../types'
import { FC } from 'react'
import styles from './Uploader.module.scss'
import cn from 'classnames'
import { Button } from 'antd'
import { useUploader } from './hooks/useUploader'

export const Uploader: FC<DetailsDivProps> = ({ className }) => {
  const {
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
  } = useUploader()
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

      <Button
        disabled={loader ? true : false}
        className={styles.btn}
        onClick={sendFiles}
        type="primary"
        size={'large'}
      >
        Отправить
      </Button>

      <ul>
        {files.map((el) => (
          <li key={el.name}>
            <img
              src={`https://disk.yandex.ru/d/8UTFs0LhpPJ_0g/${el.name}`}
              alt=""
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
