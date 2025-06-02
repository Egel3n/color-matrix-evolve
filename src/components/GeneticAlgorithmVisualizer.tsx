
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Board from './Board';
import ControlPanel from './ControlPanel';
import ScoreDisplay from './ScoreDisplay';
import { runGeneticAlgorithm, AlgorithmState, GAParams } from '@/utils/geneticAlgorithm';
import { Play, Pause, RotateCcw } from 'lucide-react';

const GeneticAlgorithmVisualizer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(100); // milliseconds between generations
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>({
    generation: 0,
    bestBoard: [],
    bestFitness: 0,
    isComplete: false,
    populationSize: 0
  });
  const [gaParams, setGAParams] = useState<GAParams>({
    populationSize: 100,
    generations: 1000,
    mutationRate: 0.1,
    eliteCount: 3
  });

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startAlgorithm = useCallback(() => {
    if (isRunning) return;
    
    setIsRunning(true);
    console.log('🚀 Starting Genetic Algorithm...');
    
    const id = runGeneticAlgorithm(gaParams, speed, (state) => {
      setAlgorithmState(state);
      if (state.isComplete) {
        setIsRunning(false);
        console.log('✅ Algorithm completed!');
      }
    });
    
    setIntervalId(id);
  }, [isRunning, gaParams, speed]);

  const stopAlgorithm = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
    console.log('⏹️ Algorithm stopped');
  }, [intervalId]);

  const resetAlgorithm = useCallback(() => {
    stopAlgorithm();
    setAlgorithmState({
      generation: 0,
      bestBoard: [],
      bestFitness: 0,
      isComplete: false,
      populationSize: 0
    });
    console.log('🔄 Algorithm reset');
  }, [stopAlgorithm]);

  // Restart algorithm when speed changes during execution
  useEffect(() => {
    if (isRunning && intervalId) {
      stopAlgorithm();
      // Small delay to ensure cleanup
      setTimeout(() => {
        startAlgorithm();
      }, 10);
    }
  }, [speed]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🧬 Genetic Algorithm Visualizer
          </h1>
          <p className="text-xl text-gray-300">
            Watch AI solve the 5x5 colored stone puzzle in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Control Panel */}
          <div className="xl:col-span-1">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  🎛️ Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={startAlgorithm}
                    disabled={isRunning}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Play size={16} className="mr-2" />
                    Start
                  </Button>
                  <Button
                    onClick={stopAlgorithm}
                    disabled={!isRunning}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <Pause size={16} className="mr-2" />
                    Stop
                  </Button>
                  <Button
                    onClick={resetAlgorithm}
                    disabled={isRunning}
                    className="flex-1 bg-gray-600 hover:bg-gray-700"
                  >
                    <RotateCcw size={16} className="mr-2" />
                    Reset
                  </Button>
                </div>
                
                <ControlPanel
                  params={gaParams}
                  onParamsChange={setGAParams}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  disabled={isRunning}
                />
              </CardContent>
            </Card>

            <div className="mt-6">
              <ScoreDisplay 
                generation={algorithmState.generation}
                fitness={algorithmState.bestFitness}
                populationSize={algorithmState.populationSize}
                isComplete={algorithmState.isComplete}
                isRunning={isRunning}
              />
            </div>
          </div>

          {/* Board and Status */}
          <div className="xl:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>🎯 Current Best Solution</span>
                  <div className="flex gap-2">
                    {algorithmState.isComplete && (
                      <Badge className="bg-green-600 text-white">
                        🎉 Complete!
                      </Badge>
                    )}
                    {isRunning && (
                      <Badge className="bg-blue-600 text-white animate-pulse">
                        🔄 Running...
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Board board={algorithmState.bestBoard} />
                </div>
                
                {/* Rules explanation */}
                <div className="mt-6 p-4 bg-black/20 rounded-lg">
                  <h3 className="text-white font-semibold mb-2">📋 Puzzle Rules:</h3>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• <span className="text-green-400">+5 points</span>: All diagonal colors are different</li>
                    <li>• <span className="text-blue-400">+1 point</span>: Each row has the same color (excluding diagonal)</li>
                    <li>• <span className="text-red-400">-2 points</span>: For each missing/extra stone of any color</li>
                    <li>• <span className="text-yellow-400">Target</span>: Maximum fitness score is 10</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneticAlgorithmVisualizer;
