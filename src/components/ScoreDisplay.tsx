
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ScoreDisplayProps {
  generation: number;
  fitness: number;
  populationSize: number;
  isComplete: boolean;
  isRunning: boolean;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  generation,
  fitness,
  populationSize,
  isComplete,
  isRunning
}) => {
  const maxFitness = 10;
  const progressPercentage = Math.max(0, (fitness / maxFitness) * 100);

  const getFitnessColor = (fitness: number) => {
    if (fitness >= 10) return 'text-green-400';
    if (fitness >= 7) return 'text-yellow-400';
    if (fitness >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          📊 Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{generation}</div>
            <div className="text-sm text-gray-300">Generation</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getFitnessColor(fitness)}`}>
              {fitness.toFixed(1)}
            </div>
            <div className="text-sm text-gray-300">Best Fitness</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Progress to Perfect Score</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="w-full h-2"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {isRunning && (
            <Badge className="bg-blue-600 text-white">
              🔄 Evolving
            </Badge>
          )}
          {isComplete && (
            <Badge className="bg-green-600 text-white">
              🎯 Solved!
            </Badge>
          )}
          {populationSize > 0 && (
            <Badge variant="outline" className="text-white border-white/30">
              Pop: {populationSize}
            </Badge>
          )}
        </div>

        <div className="text-xs text-gray-400 space-y-1">
          <div>🎯 Target: Fitness = 10</div>
          <div>🧬 Algorithm: Genetic Evolution</div>
          <div>⚡ Real-time visualization</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreDisplay;
