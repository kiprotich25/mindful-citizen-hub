
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const challenges = [
  {
    id: 1,
    title: "Practice Deep Breathing",
    description: "Take 5 minutes to practice deep breathing exercises. Inhale for 4 counts, hold for 4, exhale for 6.",
    category: "Mindfulness",
    duration: "5 minutes"
  },
  {
    id: 2,
    title: "Write Three Gratitudes",
    description: "Write down three things you're grateful for today, no matter how small they might seem.",
    category: "Gratitude",
    duration: "3 minutes"
  },
  {
    id: 3,
    title: "Take a Mindful Walk",
    description: "Step outside and take a 10-minute walk, focusing on your surroundings and breathing.",
    category: "Movement",
    duration: "10 minutes"
  },
  {
    id: 4,
    title: "Connect with Someone",
    description: "Reach out to a friend or family member you haven't spoken to in a while.",
    category: "Connection",
    duration: "15 minutes"
  },
  {
    id: 5,
    title: "Practice Self-Compassion",
    description: "Speak to yourself with the same kindness you would show a good friend.",
    category: "Self-Care",
    duration: "5 minutes"
  }
];

export const MentalHealthChallenge = () => {
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [completed, setCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Get today's challenge based on the day of the year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const challengeIndex = dayOfYear % challenges.length;
    setTodayChallenge(challenges[challengeIndex]);

    // Check if already completed today
    const completedToday = localStorage.getItem(`challenge-${new Date().toDateString()}`);
    setCompleted(!!completedToday);
  }, []);

  const markCompleted = () => {
    setCompleted(true);
    localStorage.setItem(`challenge-${new Date().toDateString()}`, 'true');
    toast({
      title: "Challenge completed! 🎉",
      description: "Great job taking care of your mental health today."
    });
  };

  if (!todayChallenge) return null;

  return (
    <Card className="border-pink-200 bg-gradient-to-r from-pink-50 to-purple-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <CardTitle className="text-pink-800">Daily Mental Health Challenge</CardTitle>
          </div>
          {completed && <CheckCircle className="h-5 w-5 text-green-600" />}
        </div>
        <CardDescription className="text-pink-700">
          Take a moment for your mental wellbeing today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">{todayChallenge.title}</h3>
            <p className="text-gray-700 mt-1">{todayChallenge.description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-pink-700 border-pink-300">
                {todayChallenge.category}
              </Badge>
              <Badge variant="outline" className="text-purple-700 border-purple-300">
                {todayChallenge.duration}
              </Badge>
            </div>
            
            <Button 
              onClick={markCompleted}
              disabled={completed}
              size="sm"
              className={completed ? "bg-green-600 hover:bg-green-700" : "bg-pink-600 hover:bg-pink-700"}
            >
              {completed ? 'Completed ✓' : 'Mark Complete'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
