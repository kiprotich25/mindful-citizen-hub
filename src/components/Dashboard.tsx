
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, Heart, Brain, Shield, MessageCircle, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ModulesSection } from '@/components/ModulesSection';
import { InstitutionsDirectory } from '@/components/InstitutionsDirectory';
import { MentalHealthChallenge } from '@/components/MentalHealthChallenge';
import { AIChat } from '@/components/AIChat';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modulesResponse, progressResponse] = await Promise.all([
        supabase.from('modules').select('*'),
        supabase.from('user_progress').select('*').eq('user_id', user?.id)
      ]);

      if (modulesResponse.data) setModules(modulesResponse.data);
      if (progressResponse.data) setUserProgress(progressResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
      description: "See you next time!"
    });
  };

  const completedModules = userProgress.filter(p => p.completed).length;
  const totalModules = modules.length;
  const progressPercentage = totalModules > 0 ? (completedModules / totalModules) * 100 : 0;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <Users className="h-6 w-6 text-green-600" />
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Civic Learn</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.user_metadata?.full_name || user?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'modules', label: 'Learning Modules', icon: Brain },
              { id: 'institutions', label: 'Institutions', icon: Users },
              { id: 'chat', label: 'AI Assistant', icon: MessageCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedModules}/{totalModules}</div>
                  <p className="text-xs text-muted-foreground">modules completed</p>
                  <Progress value={progressPercentage} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary">Civic Rights</Badge>
                    <Badge variant="secondary">Mental Health</Badge>
                    <Badge variant="secondary">Drug Awareness</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Resources</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">institutions available</p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Mental Health Challenge */}
            <MentalHealthChallenge />

            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>Jump into your learning modules</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {modules.slice(0, 3).map((module: any) => (
                    <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant={
                            module.category === 'civic' ? 'default' :
                            module.category === 'mental' ? 'secondary' : 'outline'
                          }>
                            {module.category}
                          </Badge>
                          <Badge variant="outline">{module.level}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h3 className="font-semibold text-sm">{module.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{module.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'modules' && <ModulesSection />}
        {activeTab === 'institutions' && <InstitutionsDirectory />}
        {activeTab === 'chat' && <AIChat />}
      </main>
    </div>
  );
};

export default Dashboard;
