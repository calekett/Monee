"use client";
import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  TrendingUp, Target, Plus,
  CreditCard, Wallet, PiggyBank, BarChart, Settings, DollarSign, Code
} from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  points: number;
  progress: number;
  status: 'active' | 'completed' | 'failed';
  amountNeeded: number;
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
  totalPoints: number;
  challenges: Challenge[];
  transactions: Transaction[];
}
interface Message {
  name: string;
  message: string;
}
const Chatbox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { name: "User", message: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: JSON.stringify({ message: input }),
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const botMessage: Message = { name: "Sam", message: data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    }

    setInput(""); // Clear the input field
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="container h-full w-full bg-gray-900 flex flex-col">
      {/* Chatbox Support Section */}
      <div className="chatbox__support flex flex-col h-full bg-gray-800 rounded-lg p-4">
        {/* Header */}
        <div className="chatbox__header flex items-center mb-4 border-b border-gray-700 pb-2">
          <div className="chatbox__image--header mr-3">
            <img
              src="./dollar_icon2.png"
              alt="MoneeBot"
              className="w-12 h-12 rounded"
            />
          </div>
          <div className="chatbox__content--header">
            <h4 className="chatbox__heading--header text-white font-bold">MoneeBot</h4>
            <p className="chatbox__description--header text-gray-400">
              Hi. How can I help you with your finances?
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbox__messages flex-grow overflow-y-auto bg-gray-700 rounded-lg p-4 text-white">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`messages__item ${
                msg.name === "Sam" ? "messages__item--visitor" : "messages__item--operator"
              }`}
            >
              {msg.message}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="chatbox__footer flex items-center mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={handleKeyPress}
            placeholder="Write a message..."
            className="flex-grow p-2 rounded-lg bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
          />
          <button
            onClick={handleSendMessage}
            className="chatbox__send--footer send__button bg-[#2cd3a7] text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
const initialUser: User = {
  name: 'Cale Kettner',
  age: 24,
  income: 55000,
  creditScore: 680,
  savingsGoal: 10000,
  currentSavings: 3500,
  totalPoints: 1000,
  challenges: [
    {
      id: 1,
      title: '30-Day No Dining Out Challenge',
      description: 'Save money by cooking at home',
      points: 500,
      progress: 45,
      status: 'active',
      amountNeeded: 500
    },
    {
      id: 2, 
      title: 'Emergency Fund Boost',
      description: 'Increase emergency fund by $1000',
      points: 750,
      progress: 70,
      status: 'active',
      amountNeeded: 1000
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

type ViewType = 'dashboard' | 'challenges' | 'transactions' | 'moneebot' | 'redeem' | 'settings';

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
    points: 10,
    progress: 0,
    status: 'active',
    amountNeeded: 0
  });

  // ADDED: State for handling the CSV file
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Create state to handle the count-up animation
  const [pointsCount, setPointsCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Trigger the count-up after loading finishes
  useEffect(() => {
    if (!isLoading) {
      let current = 0;
      const increment = Math.ceil(user.totalPoints / 60);

      const countInterval = setInterval(() => {
        current += increment;
        if (current >= user.totalPoints) {
          current = user.totalPoints;
          clearInterval(countInterval);
        }
        setPointsCount(current);
      }, 25);

      return () => clearInterval(countInterval);
    }
  }, [isLoading, user.totalPoints]);

  const calculateSavingsPercentage = (): number => {
    return Math.round((user.currentSavings / user.savingsGoal) * 100);
  };

  // UPDATED: Only sum expenses for the current month + year, then round
  const calculateMonthlySpending = (): number => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const spendingThisMonth = user.transactions
      .filter(t => t.type === 'expense')
      .filter(t => {
        const txDate = new Date(t.date);
        return (
          txDate.getMonth() === currentMonth && 
          txDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    // Round to nearest decimal (here, 2 decimals)
    return Math.round(spendingThisMonth * 100) / 100;
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
    setUser({ 
      ...user, 
      challenges: updatedList,
    });
    setNewChallenge({
      id: user.challenges.length + 2,
      title: '',
      description: '',
      points: 0,
      progress: 0,
      status: 'active',
      amountNeeded: 0
    });
    setShowCreateForm(false);
  };

  // ADDED: Handle CSV file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCsvFile(event.target.files[0]);
    }
  };

  // ADDED: Parse CSV lines
  const parseCSV = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    const newTransactions: Transaction[] = [];

    // We'll create transaction IDs by continuing from the last existing ID
    let nextId = user.transactions.length ? user.transactions[user.transactions.length - 1].id + 1 : 1;

    for (let line of lines) {
      // Remove surrounding quotes if present
      line = line.trim();
      if (line.startsWith('"') && line.endsWith('"')) {
        line = line.substring(1, line.length - 1);
      }

      // Split by "," inside the string
      const parts = line.split('","');
      // According to the format:
      // [date, amount, "*", "", description]
      if (parts.length >= 5) {
        const date = parts[0];
        const amountString = parts[1];
        const desc = parts[4];

        const amount = parseFloat(amountString);
        const type = amount < 0 ? 'expense' : 'income';

        // Create a new transaction object
        newTransactions.push({
          id: nextId++,
          date: date,
          description: desc,
          amount: Math.abs(amount),
          type,
          category: 'General'
        });
      }
    }

    // Append new transactions to existing ones
    setUser(prevUser => ({
      ...prevUser,
      transactions: [...prevUser.transactions, ...newTransactions]
    }));
  };

  // ADDED: Handle the CSV upload & reading
  const handleUploadCSV = () => {
    if (!csvFile) return;
    const reader = new FileReader();
    reader.onload = e => {
      if (typeof e.target?.result === 'string') {
        parseCSV(e.target.result);
      }
    };
    reader.readAsText(csvFile);
  };

  return (
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ backgroundColor: 'black', opacity: 1 }}
          animate={{ backgroundColor: 'black', opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
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
                <p className="text-gray-400 text-sm">
                  <span className="text-[#55f86b] font-bold">monee</span> - A Financial Literacy Platform
                </p>
              </div>
            </div>
            <nav className="space-y-4">
              {[
                { icon: BarChart, label: 'Dashboard', tab: 'dashboard' },
                { icon: Target, label: 'Challenges', tab: 'challenges' },
                { icon: Wallet, label: 'Transactions', tab: 'transactions' },
                { icon: Code, label: 'Moneebot', tab: 'moneebot' },
                { icon: DollarSign, label: 'Redeem', tab: 'redeem' },
                { icon: Settings, label: 'Settings', tab: 'settings' }
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
                        ${calculateMonthlySpending().toFixed(2)}
                      </span>
                      <p className="text-gray-400 text-sm mt-2">This Month</p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div 
                  variants={pageVariants}
                  className="bg-[#2cd3a7]/10 mt-6 p-10 rounded-lg text-center"
                >
                  <h3 className="text-4x1 font-bold text-white mb-2">Total Points</h3>
                  <motion.span 
                    className="text-9xl font-extrabold text-[#2cd3a7]"
                  >
                    {pointsCount}
                  </motion.span>
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
                        <label className="block text-white mb-1">Amount Needed</label>
                        <input
                          className="w-full p-2 rounded bg-gray-700 text-white"
                          type="number"
                          value={newChallenge.amountNeeded}
                          onChange={(e) => setNewChallenge({ 
                            ...newChallenge, 
                            amountNeeded: parseFloat(e.target.value) 
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
                    {user.challenges.map(challenge => {
                      const currentAmount = Math.round((challenge.progress / 100) * challenge.amountNeeded);
                      return (
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
                                {challenge.points} Points
                              </span>
                              {renderProgressBar(challenge.progress)}
                              <div className="text-white mt-2">
                                ${currentAmount} / ${challenge.amountNeeded}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div variants={pageVariants}>
                <motion.div variants={pageVariants}>
                  <h2 className="text-3xl font-bold text-white mb-6">Transactions</h2>

                  {/* ADDED: CSV Upload Section */}
                  <div className="mb-4">
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={handleFileChange}
                      className="text-white mb-2"
                    />
                    <button 
                      onClick={handleUploadCSV}
                      className="bg-[#2cd3a7] text-black px-4 py-2 rounded-lg hover:opacity-90"
                    >
                      Upload CSV
                    </button>
                  </div>
                  {/* END CSV Upload Section */}

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

            {activeTab === 'moneebot' && <Chatbox />}


            {activeTab === 'redeem' && (
              <motion.div variants={pageVariants}>
                <motion.h2 
                  variants={pageVariants}
                  className="text-3xl font-bold text-white mb-6"
                >
                  Redeem
                </motion.h2>
                <div className="text-white mb-4">
                  Redeem your hard-earned points here! You currently have {pointsCount} points
                </div>

                <div className="mb-6">
                  <h3 className="text-xl text-white mb-2">20,000 Points</h3>
                  <div className="relative group w-64 h-64">
                    <img
                      src="/bn.png"
                      alt="bn"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 
                                 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="text-white text-lg font-bold">
                        10% Off TAMU B&N
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl text-white mb-2">40,000 Points</h3>
                  <p className="text-white">More rewards coming soon!</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl text-white mb-2">60,000 Points</h3>
                  <p className="text-white">More rewards coming soon!</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl text-white mb-2">80,000 Points</h3>
                  <p className="text-white">More rewards coming soon!</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl text-white mb-2">100,000 Points</h3>
                  <p className="text-white">More rewards coming soon!</p>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'settings' && (
              <motion.div variants={pageVariants}>
                <motion.h2 
                  variants={pageVariants}
                  className="text-3xl font-bold text-white mb-6"
                >
                  Settings
                </motion.h2>
                <motion.p variants={pageVariants} className="text-white">
                  hi
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
