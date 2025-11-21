import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardStats } from "@/components/DashboardStats";
import { ExpenseChart } from "@/components/ExpenseChart";
import { RecentTransactions } from "@/components/RecentTransactions";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  date: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget] = useState(5000);
  const [savings] = useState(1200);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    const fetchExpenses = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/api/expenses/recent`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast({
          title: "Error",
          description: "Failed to load expenses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExpenses();
  }, [token, navigate, toast]);

  const handleAddExpense = async (expense: Omit<Transaction, "id">) => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(expense),
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const newExpense = await response.json();
      setTransactions([newExpense, ...transactions]);
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  const percentChange = 8.5;

  const categoryData = transactions.reduce((acc, transaction) => {
    const existing = acc.find(item => item.category === transaction.category);
    if (existing) {
      existing.amount += transaction.amount;
    } else {
      acc.push({ category: transaction.category, amount: transaction.amount });
    }
    return acc;
  }, [] as { category: string; amount: number }[]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Smart Expense Tracker</h1>
                <p className="text-sm text-muted-foreground">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AddExpenseDialog onAddExpense={handleAddExpense} />
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
            <DashboardStats
              totalExpenses={totalExpenses}
              budget={budget}
              savings={savings}
              percentChange={percentChange}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Analytics</h2>
            <ExpenseChart data={categoryData} />
          </section>

          <section>
            <RecentTransactions transactions={transactions} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
