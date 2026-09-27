import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { FolderOpen } from 'lucide-react';

export const ProjectenPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Projecten
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Beheer en volg uw development projecten
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            Uw Projecten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 dark:text-slate-400">
            Deze pagina wordt in de toekomst uitgebreid met project management functionaliteit.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};