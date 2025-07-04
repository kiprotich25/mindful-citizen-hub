
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, BookOpen, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ModuleModal } from './ModuleModal';

export const ModulesSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [modules, setModules] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modulesResponse, progressResponse] = await Promise.all([
        supabase.from('modules').select('*').order('category', { ascending: true }),
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

  const filteredModules = modules.filter((module: any) => 
    filter === 'all' || module.category === filter
  );

  const isModuleCompleted = (moduleId: string) => {
    return userProgress.some((progress: any) => 
      progress.module_id === moduleId && progress.completed
    );
  };

  const getModuleProgress = (moduleId: string) => {
    return userProgress.find((progress: any) => progress.module_id === moduleId);
  };

  const openModuleModal = (module: any) => {
    setSelectedModule(module);
    setModalOpen(true);
  };

  const toggleModuleCompletion = async (moduleId: string) => {
    const existingProgress = userProgress.find((p: any) => p.module_id === moduleId);
    
    try {
      if (existingProgress) {
        const { error } = await supabase
          .from('user_progress')
          .update({ 
            completed: !existingProgress.completed,
            completed_at: !existingProgress.completed ? new Date().toISOString() : null
          })
          .eq('id', existingProgress.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_progress')
          .insert({
            user_id: user?.id,
            module_id: moduleId,
            completed: true,
            completed_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      await fetchData();
      toast({
        title: "Progress updated",
        description: "Your learning progress has been saved."
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress.",
        variant: "destructive"
      });
    }
  };

  const getOverallProgress = () => {
    const completedCount = userProgress.filter(p => p.completed).length;
    const totalModules = modules.length;
    return totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  };

  if (loading) {
    return <div className="text-center py-8">Loading modules...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Learning Modules</h2>
          <p className="text-gray-600">Explore our comprehensive educational content</p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="civic">Civic Rights</SelectItem>
            <SelectItem value="mental">Mental Health</SelectItem>
            <SelectItem value="drugs">Drug Awareness</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Your Learning Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completed Modules</span>
              <span>{userProgress.filter(p => p.completed).length} / {modules.length}</span>
            </div>
            <Progress value={getOverallProgress()} className="h-2" />
            <p className="text-xs text-gray-600">
              {getOverallProgress().toFixed(0)}% of all modules completed
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((module: any) => {
          const completed = isModuleCompleted(module.id);
          const progress = getModuleProgress(module.id);
          
          return (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={
                    module.category === 'civic' ? 'default' :
                    module.category === 'mental' ? 'secondary' : 'outline'
                  }>
                    {module.category === 'civic' ? 'Civic Rights' :
                     module.category === 'mental' ? 'Mental Health' : 'Drug Awareness'}
                  </Badge>
                  <Badge variant="outline">{module.level}</Badge>
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span>{module.title}</span>
                  {completed ? 
                    <CheckCircle className="h-5 w-5 text-green-600" /> : 
                    <Circle className="h-5 w-5 text-gray-400" />
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {module.content}
                </CardDescription>
                
                {progress && (
                  <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
                    {completed ? (
                      <span className="text-green-600 font-medium">
                        ✓ Completed on {new Date(progress.completed_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-blue-600">📚 In Progress</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openModuleModal(module)}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Module
                  </Button>
                  <Button 
                    size="sm" 
                    variant={completed ? "secondary" : "default"}
                    onClick={() => toggleModuleCompletion(module.id)}
                  >
                    {completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
          <p className="text-gray-600">Try adjusting your filter or check back later for new content.</p>
        </div>
      )}

      {/* Module Modal */}
      <ModuleModal
        module={selectedModule}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onProgressUpdate={fetchData}
      />
    </div>
  );
};
