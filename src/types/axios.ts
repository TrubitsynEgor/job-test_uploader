export type LinkResponse = {
  operation_id: string
  href: string
  method: 'PUT' | 'GET' | 'POST' | 'DELETE'
  templated: boolean
}
