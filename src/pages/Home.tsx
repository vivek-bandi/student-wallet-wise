import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingUp, PieChart, Bell } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Wallet className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Student Wallet Wise</h1>
              <p className="text-sm text-muted-foreground">Manage your finances smartly</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline" size="lg">
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg">
                Sign Up
              </Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 text-foreground">
            Track Your Expenses,
            <br />
            <span className="text-primary">Achieve Your Goals</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            A simple and powerful expense tracker designed for students. Keep track of your spending,
            set budgets, and make informed financial decisions.
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Track Expenses</CardTitle>
              <CardDescription>
                Log and categorize all your expenses in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Set Budgets</CardTitle>
              <CardDescription>
                Create monthly budgets and stay within your limits
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <PieChart className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Visual Analytics</CardTitle>
              <CardDescription>
                Understand your spending patterns with charts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Recurring Expenses</CardTitle>
              <CardDescription>
                Automatically track your recurring payments
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card border border-border rounded-2xl p-12 max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-4 text-foreground">Ready to take control?</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of students who are managing their finances better
          </p>
          <Link to="/signup">
            <Button size="lg" className="text-lg px-8 py-6">
              Create Your Free Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
