export interface Expenses {
  totalAmount: number
  expenses: Expense[]
}

export interface Expense {
  id?: string
  user: string
  title: string
  amount: number
  date: string
  category: string
  __v: number
}
