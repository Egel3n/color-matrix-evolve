
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { GAParams } from '@/utils/geneticAlgorithm';

interface ControlPanelProps {
  params: GAParams;
  onParamsChange: (params: GAParams) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  params, 
  onParamsChange, 
  speed, 
  onSpeedChange, 
  disabled 
}) => {
  const updateParam = (key: keyof GAParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  const getSpeedLabel = (speed: number) => {
    if (speed <= 50) return 'Very Fast';
    if (speed <= 100) return 'Fast';
    if (speed <= 200) return 'Normal';
    if (speed <= 500) return 'Slow';
    return 'Very Slow';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-white">Speed: {getSpeedLabel(speed)} ({speed}ms)</Label>
        <Slider
          value={[speed]}
          onValueChange={([value]) => onSpeedChange(value)}
          min={10}
          max={1000}
          step={10}
          disabled={disabled}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Population Size: {params.populationSize}</Label>
        <Slider
          value={[params.populationSize]}
          onValueChange={([value]) => updateParam('populationSize', value)}
          min={50}
          max={500}
          step={50}
          disabled={disabled}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Max Generations: {params.generations}</Label>
        <Slider
          value={[params.generations]}
          onValueChange={([value]) => updateParam('generations', value)}
          min={100}
          max={2000}
          step={100}
          disabled={disabled}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Mutation Rate: {(params.mutationRate * 100).toFixed(1)}%</Label>
        <Slider
          value={[params.mutationRate * 100]}
          onValueChange={([value]) => updateParam('mutationRate', value / 100)}
          min={1}
          max={50}
          step={1}
          disabled={disabled}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white">Elite Count: {params.eliteCount}</Label>
        <Slider
          value={[params.eliteCount]}
          onValueChange={([value]) => updateParam('eliteCount', value)}
          min={1}
          max={10}
          step={1}
          disabled={disabled}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ControlPanel;
