import React from 'react'
import MainPage from './pages/MainPage'
import CardTransactionDetailPage from './pages/CardTransactionDetailPage'

export default function App() {
  const [openTransactionId, setOpenTransactionId] = React.useState<string | null>(null)

  if (openTransactionId) {
    return (
      <CardTransactionDetailPage
        transactionId={openTransactionId}
        onBack={() => setOpenTransactionId(null)}
      />
    )
  }

  return (
    <MainPage onOpenTransaction={setOpenTransactionId} />
  )
}
