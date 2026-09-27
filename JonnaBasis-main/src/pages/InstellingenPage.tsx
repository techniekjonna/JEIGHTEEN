import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Settings } from 'lucide-react';

export const InstellingenPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Instellingen
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Configureer uw account en voorkeuren
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Account Instellingen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400">
            Deze pagina wordt in de toekomst uitgebreid met gebruikersinstellingen en voorkeuren.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};