
import { PoliciesPage } from './pages/AllPoliciesPage';
import React from 'react'
import MainPage from './pages/MainPage'
import CardTransactionDetailPage from './pages/CardTransactionDetailPage'
import { api } from './services/api';
import type { Transaction } from './types2';

export default function App() {
  const [openTransactionId, setOpenTransactionId] = React.useState<string | null>(null)
  const [showPoliciesPage, setShowPoliciesPage] = React.useState(false)
  const [transactions, setTransactions] = React.useState<Transaction[]>([])
  const [loading, setLoading] = React.useState(true)

  // Load transactions on mount
  React.useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await api.getTransactions()
      setTransactions(data)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (showPoliciesPage) {
    return (
      <PoliciesPage onBack={() => setShowPoliciesPage(false)} />
    )
  }
  else if (openTransactionId) {
    return (
      <CardTransactionDetailPage
        transactionId={openTransactionId}
        transactions={transactions}
        onBack={() => setOpenTransactionId(null)}
      />
    )
  }
  else {
    return (
      <MainPage 
        transactions={transactions}
        setTransactions={setTransactions}
        loading={loading}
        onOpenTransaction={setOpenTransactionId}
        onOpenPolicies={() => setShowPoliciesPage(true)}
      />
    )
  }
}


