
import React, { useEffect, useMemo, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GradingIcon from '@mui/icons-material/Grading';
import { AppBar, Box, CssBaseline, Divider, Toolbar, Typography } from '@mui/material';
import './App.css';
import Transactions from './components/transactions';
import MonthlyRewards from './components/monthlyRewards';
import TotalRewards from './components/totalRewards';
import fetchTransactions from './api/transactionAPI';
import { calculateTransactionRewards } from './util/rewardCalculation';
import { isPriceValid } from './util/util';

const MENUS = [
  { id: 'transactions', label: 'Transactions', icon: <ReceiptIcon /> },
  { id: 'monthly', label: 'User monthly rewards', icon: <CalendarMonthIcon /> },
  { id: 'total', label: 'Total Rewards', icon: <GradingIcon /> },
]
const drawerWidth = 240;

function getMonthYearLabel(purchaseDate) {
  const parts = String(purchaseDate).split('-')
  if (parts.length >= 3) return `${parts[1]}-${parts[2]}`
  return String(purchaseDate)
}


function App() {
  const [activeMenu, setActiveMenu] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [loader,setLoader] = useState(false);

  function buildRewardsData(transactions) {
    const monthlyRewardsMap = new Map();
    const totalRewardsMap = new Map();
    const transactionsWithRewards = transactions.map((transaction) => {
      //transactions data
      const customerName = String([transaction.firstName, transaction.lastName].filter(Boolean).join(' ')).trim();
      const rewardPoints = calculateTransactionRewards(transaction.price);
      const formattedPrice = isPriceValid(transaction.price) ? Math.trunc(transaction.price) : 0;
      const formattedRewards= rewardPoints !== null ? rewardPoints : 0;
      //monthly data
      const month = getMonthYearLabel(transaction.purchaseDate)
      const monthlyKey = `${transaction.customerId}-${month}`;
      const monthlyExisting = monthlyRewardsMap.get(monthlyKey) || {
        customerName: customerName,
        month:month.split('-')[0]-1 || 'Invalid month',
        transactions: 0,
        totalAmount: 0,
        rewardPoints: 0,
        id: monthlyKey,
        customerId: transaction.customerId,
        year: month.split('-')[1] || 'Invalid year',
        purchaseDate: transaction.purchaseDate
      }
      monthlyExisting.transactions += 1;
      monthlyExisting.totalAmount += +formattedPrice;
      monthlyExisting.rewardPoints += +formattedRewards;
      monthlyRewardsMap.set(monthlyKey, monthlyExisting);
      //total data
      const totalExisting = totalRewardsMap.get(transaction.customerId) || {
        customerName: customerName,
        transactions: 0,
        totalAmount: 0,
        rewardPoints: 0,
        id: transaction.customerId
      }
      totalExisting.transactions += 1;
      totalExisting.totalAmount += +formattedPrice;
      totalExisting.rewardPoints += +formattedRewards;
      totalRewardsMap.set(transaction.customerId, totalExisting);
      return {
        ...transaction,
        customerName,
        rewardPoints: rewardPoints
      }
    })

    return {
      transactionsWithRewards: transactionsWithRewards,
      monthlyTransactionalRewards: Array.from(monthlyRewardsMap.values()),
      totalTransactionalRewards: Array.from(totalRewardsMap.values())
    };
  }


  const {
    transactionsWithRewards,
    monthlyTransactionalRewards,
    totalTransactionalRewards,
  } = useMemo(() => buildRewardsData(transactions), [transactions]);
  
  useEffect(() => {
    const loadTransactions = async () => {
      setLoader(true);
      try {
        const transactions = await fetchTransactions();
        setTransactions(transactions);
      } catch (err) {
        console.error('Error loading transactions:', err);
      } finally {
        setLoader(false);
      }
    };

    loadTransactions();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 ,
          backgroundColor: '#7f9dba',
        fontcolor: '#0b0a0a'}}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Customer Transactions and Rewards
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }} variant="permanent" anchor="left">
        <Toolbar />
        <Divider />
        <List>
          {MENUS.map((menu) => (
            <ListItem key={menu.id} disablePadding>
              <ListItemButton onClick={() => setActiveMenu(menu.id)} selected={activeMenu === menu.id}>
                <ListItemIcon>
                  {menu.icon}
                </ListItemIcon>
                <ListItemText primary={menu.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        {activeMenu === 'transactions' && <Transactions transactions={transactionsWithRewards} loading={loader} />}
        {activeMenu === 'monthly' && <MonthlyRewards monthlyTransactionalRewards={monthlyTransactionalRewards} loading={loader} />}
        {activeMenu === 'total' && <TotalRewards totalTransactionalRewards={totalTransactionalRewards} loading={loader} />}
      </Box>
    </Box>
  );
}

export default App;
