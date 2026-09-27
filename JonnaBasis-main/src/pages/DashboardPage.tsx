import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { User, BookOpen, Target, TrendingUp } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Actieve Projecten',
      value: '0',
      icon: BookOpen,
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Voltooide Taken',
      value: '0',
      icon: Target,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Voortgang',
      value: '0%',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Welkom terug bij uw developer leerpad
        </p>
      </div>

      {/* Welcome Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Welkom, {user?.email}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400">
            Hier kunt u uw voortgang volgen, projecten beheren en uw developer vaardigheden ontwikkelen.
            Selecteer een optie in het zijmenu om te beginnen.
          </p>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for future content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400">
            Uw recente activiteiten worden hier weergegeven wanneer u begint met projecten.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};