export interface Document {
  id: string
  text: string
  content: string
  completed: boolean
  modified?: Date | null
  deletedAt?: Date | null
}
