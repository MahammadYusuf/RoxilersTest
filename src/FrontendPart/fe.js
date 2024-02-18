import React, {useState, useEffect} from 'react'
import TransactionsTable from './TransactionsTable'
import TransactionsStatistics from './TransactionsStatistics'
import TransactionsBarChart from './TransactionsBarChart'
import {fetchTransactions, fetchStatistics, fetchBarChartData} from './api' // Assuming you have functions to fetch data from APIs

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [statistics, setStatistics] = useState({})
  const [barChartData, setBarChartData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('March')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions for the selected month
        const transactionsData = await fetchTransactions(selectedMonth)
        setTransactions(transactionsData)

        // Fetch statistics for the selected month
        const statisticsData = await fetchStatistics(selectedMonth)
        setStatistics(statisticsData)

        // Fetch bar chart data for the selected month
        const barChartData = await fetchBarChartData(selectedMonth)
        setBarChartData(barChartData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [selectedMonth])

  const handleSearch = async searchText => {
    setSearchText(searchText)
    try {
      // Call API to fetch transactions based on search text
      const filteredTransactions = await fetchTransactions(
        selectedMonth,
        searchText,
      )
      setTransactions(filteredTransactions)
    } catch (error) {
      console.error('Error fetching filtered transactions:', error)
    }
  }

  const handleNextPage = async () => {
    setCurrentPage(currentPage + 1)
    try {
      // Call API to fetch next page transactions
      const nextPageTransactions = await fetchTransactions(
        selectedMonth,
        searchText,
        currentPage + 1,
      )
      setTransactions(nextPageTransactions)
    } catch (error) {
      console.error('Error fetching next page transactions:', error)
    }
  }

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      try {
        // Call API to fetch previous page transactions
        const prevPageTransactions = await fetchTransactions(
          selectedMonth,
          searchText,
          currentPage - 1,
        )
        setTransactions(prevPageTransactions)
      } catch (error) {
        console.error('Error fetching previous page transactions:', error)
      }
    }
  }

  return (
    <div>
      <select
        value={selectedMonth}
        onChange={e => setSelectedMonth(e.target.value)}
      >
        {/* Options for selecting month */}
      </select>
      <TransactionsStatistics statistics={statistics} />
      <TransactionsTable
        transactions={transactions}
        searchText={searchText}
        currentPage={currentPage}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
        onSearch={handleSearch}
      />
      <TransactionsBarChart data={barChartData} />
    </div>
  )
}

export default Dashboard
