"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  TrendingUp, Target, Plus,
  CreditCard, Wallet, PiggyBank, BarChart, Settings 
} from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  reward: number;
  progress: number;
  status: 'active' | 'completed' | 'failed';
}

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
}

interface User {
  name: string;
  age: number;
  income: number;
  creditScore: number;
  savingsGoal: number;
  currentSavings: number;
  challenges: Challenge[];
  transactions: Transaction[];
}

const initialUser: User = {
  name: 'Cale Kettner',
  age: 24,
  income: 55000,
  creditScore: 680,
  savingsGoal: 10000,
  currentSavings: 3500,
  challenges: [
    {
      id: 1,
      title: '30-Day No Dining Out Challenge',
      description: 'Save money by cooking at home',
      reward: 500,
      progress: 45,
      status: 'active'
    },
    {
      id: 2, 
      title: 'Emergency Fund Boost',
      description: 'Increase emergency fund by $1000',
      reward: 750,
      progress: 70,
      status: 'active'
    }
  ],
  transactions: [
    {
      id: 1,
      date: '2024-01-15',
      description: 'Grocery Shopping',
      amount: 85.50,
      type: 'expense',
      category: 'Food'
    },
    {
      id: 2,
      date: '2024-01-20',
      description: 'Salary Deposit',
      amount: 2750,
      type: 'income',
      category: 'Salary'
    }
  ]
};

type ViewType = 'dashboard' | 'challenges' | 'transactions' | 'moneebot';

const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2
    }
  }
};

const logoVariants: Variants = {
  initial: { 
    scale: 1,
    opacity: 1
  },
  animate: { 
    scale: 0,
    opacity: 0,
    transition: { 
      duration: 1.8,
      ease: "easeInOut" 
    }
  }
};

const FinancialFitnessCoach: React.FC = () => {
  const [user, setUser] = useState<User>(initialUser);
  const [activeTab, setActiveTab] = useState<ViewType>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newChallenge, setNewChallenge] = useState<Challenge>({
    id: user.challenges.length + 1,
    title: '',
    description: '',
    reward: 0,
    progress: 0,
    status: 'active'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const calculateSavingsPercentage = (): number => {
    return Math.round((user.currentSavings / user.savingsGoal) * 100);
  };

  const calculateMonthlySpending = (): number => {
    return user.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const renderProgressBar = (progress: number, color: string = 'bg-[#55f86b]') => {
    return (
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-2">
        <div 
          className={`${color} h-2.5 rounded-full`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  const handleCreateChallengeSubmit = (e: FormEvent) => {
    e.preventDefault();
    const updatedList = [
      ...user.challenges, 
      { ...newChallenge, id: user.challenges.length + 1 }
    ];
    setUser({ ...user, challenges: updatedList });
    setNewChallenge({
      id: user.challenges.length + 2,
      title: '',
      description: '',
      reward: 0,
      progress: 0,
      status: 'active'
    });
    setShowCreateForm(false);
  };

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ backgroundColor: 'black', opacity: 1 }}
          animate={{ backgroundColor: 'black', opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 }  }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.img
            src="/dollar_icon2.png"
            alt="Logo"
            variants={logoVariants}
            initial="initial"
            animate="animate"
            width="100"
            height="100"
            className="absolute"
          />
        </motion.div>
      ) : (
        <motion.div
          initial="initial"
          animate="animate"
          variants={pageVariants}
          className="min-h-screen bg-[#1a1a1a] flex"
        >
          <div className="w-64 bg-[#252525] p-6 flex flex-col">
            <div className="flex items-center space-x-4 mb-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#2cd3a7]/20 p-3 rounded-full"
              >
                <img src="/dollar_icon2.png" alt="Logo" width="40" height="40"/>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-[#2cd3a7]">{user.name}</h1>
                <p className="text-gray-400 text-sm">monee - A Financial Literacy Platform</p>
              </div>
            </div>
            <nav className="space-y-4">
              {[
                { icon: BarChart, label: 'Dashboard', tab: 'dashboard' },
                { icon: Target, label: 'Challenges', tab: 'challenges' },
                { icon: Wallet, label: 'Transactions', tab: 'transactions' },
                { icon: PiggyBank, label: 'Moneebot', tab: 'moneebot' },
                { icon: Settings, label: 'Settings', tab: null }
              ].map(({ icon: Icon, label, tab }) => (
                <button
                  key={label}
                  onClick={() => tab && setActiveTab(tab as ViewType)}
                  className={`flex items-center w-full p-3 rounded-lg ${
                    activeTab === tab 
                      ? 'bg-[#2cd3a7]/20 text-[#2cd3a7]' 
                      : 'text-gray-400 hover:bg-[#313131]'
                  }`}
                >
                  <Icon className="mr-3" size={20} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-grow p-8 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <motion.div variants={pageVariants}>
                <motion.h2 
                  variants={pageVariants}
                  className="text-3xl font-bold text-white mb-6"
                >
                  Welcome, {user.name}
                </motion.h2>
                <motion.div 
                  variants={pageVariants}
                  className="grid grid-cols-3 gap-6"
                >
                  <motion.div 
                    variants={pageVariants}
                    className="bg-[#2cd3a7]/10 p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Savings Progress</h3>
                      <PiggyBank className="text-[#2cd3a7]" size={24} />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white">
                        ${user.currentSavings} / ${user.savingsGoal}
                      </span>
                      <span className="text-white font-bold">
                        {calculateSavingsPercentage()}%
                      </span>
                    </div>
                    {renderProgressBar(calculateSavingsPercentage())}
                  </motion.div>

                  <motion.div 
                    variants={pageVariants}
                    className="bg-[#414141] p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Credit Score</h3>
                      <CreditCard className="text-[#55f86b]" size={24} />
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">{user.creditScore}</span>
                      <p className="text-gray-400 text-sm mt-2">Good Standing</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    variants={pageVariants}
                    className="bg-[#414141] p-6 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">Monthly Spending</h3>
                      <TrendingUp className="text-[#ff6b6b]" size={24} />
                    </div>
                    <div className="text-center">
                      <span className="text-3xl font-bold text-white">
                        ${calculateMonthlySpending()}
                      </span>
                      <p className="text-gray-400 text-sm mt-2">This Month</p>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'challenges' && (
              <motion.div variants={pageVariants}>
                <motion.div variants={pageVariants}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-white">Active Challenges</h2>
                    <button 
                      className="bg-[#2cd3a7] text-black px-4 py-2 rounded-lg 
                      hover:opacity-90 transition flex items-center"
                      onClick={() => setShowCreateForm(true)}
                    >
                      <Plus className="mr-2" size={20} />
                      Create Challenge
                    </button>
                  </div>

                  {showCreateForm && (
                    <form 
                      onSubmit={handleCreateChallengeSubmit}
                      className="bg-[#414141] p-4 rounded-lg mb-6 space-y-4"
                    >
                      <div>
                        <label className="block text-white mb-1">Title</label>
                        <input
                          className="w-full p-2 rounded bg-gray-700 text-white"
                          type="text"
                          value={newChallenge.title}
                          onChange={(e) => setNewChallenge({ 
                            ...newChallenge, 
                            title: e.target.value 
                          })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-1">Description</label>
                        <input
                          className="w-full p-2 rounded bg-gray-700 text-white"
                          type="text"
                          value={newChallenge.description}
                          onChange={(e) => setNewChallenge({ 
                            ...newChallenge, 
                            description: e.target.value 
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-1">Reward</label>
                        <input
                          className="w-full p-2 rounded bg-gray-700 text-white"
                          type="number"
                          value={newChallenge.reward}
                          onChange={(e) => setNewChallenge({ 
                            ...newChallenge, 
                            reward: parseFloat(e.target.value) 
                          })}
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="bg-[#2cd3a7] text-black px-4 py-2 rounded-lg hover:opacity-90"
                      >
                        Add Challenge
                      </button>
                    </form>
                  )}

                  <div className="space-y-4">
                    {user.challenges.map(challenge => (
                      <div 
                        key={challenge.id} 
                        className="bg-[#414141] border-2 border-[#2cd3a7]/20 rounded-lg p-5 hover:shadow-sm transition"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-white text-xl">{challenge.title}</h4>
                            <p className="text-gray-300 text-sm">{challenge.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-bold text-lg">
                              ${challenge.reward} Reward
                            </span>
                            {renderProgressBar(challenge.progress)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div variants={pageVariants}>
                <motion.div variants={pageVariants}>
                  <h2 className="text-3xl font-bold text-white mb-6">Transactions</h2>
                  <div className="bg-[#414141] rounded-lg">
                    <table className="w-full text-white">
                      <thead className="border-b border-[#2cd3a7]/20">
                        <tr>
                          <th className="p-4 text-left">Date</th>
                          <th className="p-4 text-left">Description</th>
                          <th className="p-4 text-left">Category</th>
                          <th className="p-4 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.transactions.map(transaction => (
                          <tr 
                            key={transaction.id} 
                            className="hover:bg-[#2cd3a7]/10 transition"
                          >
                            <td className="p-4">{transaction.date}</td>
                            <td className="p-4">{transaction.description}</td>
                            <td className="p-4">{transaction.category}</td>
                            <td 
                              className={`p-4 text-right ${
                                transaction.type === 'income' 
                                  ? 'text-[#55f86b]' 
                                  : 'text-[#ff6b6b]'
                              }`}
                            >
                              ${transaction.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'moneebot' && (
              <motion.div variants={pageVariants}>
                <motion.h2 
                  variants={pageVariants}
                  className="text-3xl font-bold text-white mb-6"
                >
                  Moneebot
                </motion.h2>
                <motion.p variants={pageVariants} className="text-white">
                  Get personalized financial advice from moneebot.
                </motion.p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FinancialFitnessCoach;
