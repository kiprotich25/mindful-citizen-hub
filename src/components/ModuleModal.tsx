
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, BookOpen, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ModuleModalProps {
  module: any;
  isOpen: boolean;
  onClose: () => void;
  onProgressUpdate: () => void;
}

export const ModuleModal = ({ module, isOpen, onClose, onProgressUpdate }: ModuleModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && module) {
      fetchQuizzes();
    }
  }, [isOpen, module]);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('module_id', module.id);

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAnswerSelect = (quizIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [quizIndex]: answer
    }));
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      // Calculate score
      let correctAnswers = 0;
      quizzes.forEach((quiz: any, index) => {
        if (selectedAnswers[index] === quiz.correct_answer) {
          correctAnswers++;
        }
      });
      
      const finalScore = (correctAnswers / quizzes.length) * 100;
      setScore(finalScore);
      setShowResults(true);

      // Update user progress if score >= 70%
      if (finalScore >= 70) {
        await updateProgress(true);
      }

      toast({
        title: "Quiz completed!",
        description: `You scored ${finalScore.toFixed(0)}%${finalScore >= 70 ? ' - Module completed!' : ''}`
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Error",
        description: "Failed to submit quiz.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (completed: boolean) => {
    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user?.id,
          module_id: module.id,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null
        });

      if (error) throw error;
      onProgressUpdate();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setCurrentQuiz(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>{module?.title}</span>
          </DialogTitle>
          <DialogDescription>
            Category: {module?.category} | Level: {module?.level}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Module Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Module Content</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{module?.content}</p>
            </CardContent>
          </Card>

          {/* Quizzes Section */}
          {quizzes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-4 w-4" />
                  <span>Knowledge Check</span>
                </CardTitle>
                <CardDescription>
                  Complete the quiz to test your understanding (70% required to pass)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showResults ? (
                  <div className="space-y-6">
                    {quizzes.map((quiz: any, index) => (
                      <div key={quiz.id} className="space-y-3">
                        <h4 className="font-medium">Question {index + 1}: {quiz.question}</h4>
                        <RadioGroup
                          value={selectedAnswers[index] || ''}
                          onValueChange={(value) => handleAnswerSelect(index, value)}
                        >
                          {Array.isArray(quiz.options) && quiz.options.map((option: string, optionIndex: number) => (
                            <div key={optionIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${quiz.id}-${optionIndex}`} />
                              <Label htmlFor={`${quiz.id}-${optionIndex}`}>{option}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ))}
                    
                    <Button 
                      onClick={submitQuiz} 
                      disabled={Object.keys(selectedAnswers).length !== quizzes.length || loading}
                      className="w-full"
                    >
                      {loading ? 'Submitting...' : 'Submit Quiz'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                        {score.toFixed(0)}%
                      </div>
                      {score >= 70 ? (
                        <div className="flex items-center justify-center space-x-2 text-green-600 mt-2">
                          <CheckCircle className="h-5 w-5" />
                          <span>Module Completed!</span>
                        </div>
                      ) : (
                        <p className="text-red-600 mt-2">You need 70% to complete this module</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Results:</h4>
                      {quizzes.map((quiz: any, index) => (
                        <div key={quiz.id} className="p-3 border rounded">
                          <p className="font-medium">{quiz.question}</p>
                          <p className="text-sm text-gray-600">Your answer: {selectedAnswers[index]}</p>
                          <p className="text-sm text-gray-600">Correct answer: {quiz.correct_answer}</p>
                          <Badge variant={selectedAnswers[index] === quiz.correct_answer ? 'default' : 'destructive'}>
                            {selectedAnswers[index] === quiz.correct_answer ? 'Correct' : 'Incorrect'}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button onClick={resetQuiz} variant="outline">
                        Retake Quiz
                      </Button>
                      <Button onClick={onClose}>
                        Continue Learning
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {quizzes.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No quiz available for this module yet.</p>
                <Button 
                  onClick={() => updateProgress(true)}
                  className="mt-4"
                >
                  Mark as Completed
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
