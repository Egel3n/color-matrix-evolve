
export const COLORS = ["Red", "Blue", "Green", "Yellow", "Purple"];

export interface GAParams {
  populationSize: number;
  generations: number;
  mutationRate: number;
  eliteCount: number;
}

export interface AlgorithmState {
  generation: number;
  bestBoard: string[][];
  bestFitness: number;
  isComplete: boolean;
  populationSize: number;
}

export interface Individual {
  board: string[][];
  fitness: number;
}

// Generate a random 5x5 board with 5 stones of each color
export function generateRandomBoard(): string[][] {
  const stones: string[] = [];

  // Add 5 stones of each color
  for (const color of COLORS) {
    for (let i = 0; i < 5; i++) {
      stones.push(color);
    }
  }

  // Fisher-Yates Shuffle
  for (let i = stones.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [stones[i], stones[j]] = [stones[j], stones[i]];
  }

  // Create 5x5 matrix
  const board: string[][] = [];
  for (let i = 0; i < 5; i++) {
    board.push(stones.slice(i * 5, (i + 1) * 5));
  }

  return board;
}

// Calculate fitness score based on the rules
export function fitness(board: string[][]): number {
  let score = 0;

  // 1. Diagonal colors should be different (+5 points)
  const diagonalColors = new Set<string>();
  for (let i = 0; i < 5; i++) {
    diagonalColors.add(board[i][i]);
  }
  if (diagonalColors.size === 1) {
    score += 5;
  }

  // 2. Each row should have the same color (excluding diagonal) (+1 point per row)
  for (let i = 0; i < 5; i++) {
    const row = board[i];
    const nonDiagonalCells = row.filter((_, j) => j !== i);
    
    if (nonDiagonalCells.length > 0) {
      const refColor = nonDiagonalCells[0];
      const allSame = nonDiagonalCells.every(color => color === refColor);
      if (allSame) score += 1;
    }
  }

  // 3. Each color should appear exactly 5 times (-2 points per deviation)
  const flat = board.flat();
  const count: Record<string, number> = {};
  for (const color of flat) {
    count[color] = (count[color] || 0) + 1;
  }

  for (const color of COLORS) {
    const diff = Math.abs((count[color] || 0) - 5);
    score -= diff * 2;
  }

  return score;
}

// Generate initial population
export function generatePopulation(size: number): Individual[] {
  const population: Individual[] = [];
  for (let i = 0; i < size; i++) {
    const board = generateRandomBoard();
    population.push({
      board,
      fitness: fitness(board),
    });
  }
  return population;
}

// Crossover two parents to create a child
export function crossover(parent1: string[][], parent2: string[][]): string[][] {
  const flatten1 = parent1.flat();
  const flatten2 = parent2.flat();

  const child: string[] = [];
  const colorCount: Record<string, number> = {};

  // Take first part from parent1
  const cutPoint = Math.floor(Math.random() * 25);
  for (let i = 0; i < cutPoint; i++) {
    const color = flatten1[i];
    child.push(color);
    colorCount[color] = (colorCount[color] || 0) + 1;
  }

  // Fill the rest from parent2 (skip if color count exceeds 5)
  for (let i = 0; i < 25 && child.length < 25; i++) {
    const color = flatten2[i];
    if ((colorCount[color] || 0) < 5) {
      child.push(color);
      colorCount[color] = (colorCount[color] || 0) + 1;
    }
  }

  // Convert back to 5x5 board
  const board: string[][] = [];
  for (let i = 0; i < 5; i++) {
    board.push(child.slice(i * 5, (i + 1) * 5));
  }

  return board;
}

// Mutate a board by swapping colors
export function mutate(board: string[][], mutationRate: number): string[][] {
  const flat = board.flat();

  // Track color positions
  const colorIndices: Record<string, number[]> = {};
  for (let i = 0; i < flat.length; i++) {
    const color = flat[i];
    if (!colorIndices[color]) colorIndices[color] = [];
    colorIndices[color].push(i);
  }

  // Apply mutations
  for (let i = 0; i < flat.length; i++) {
    if (Math.random() < mutationRate) {
      const originalColor = flat[i];
      const possibleNewColors = COLORS.filter((c) => c !== originalColor);
      const newColor = possibleNewColors[Math.floor(Math.random() * possibleNewColors.length)];

      // Find a stone of the new color to swap with
      const candidates = colorIndices[newColor];
      if (candidates && candidates.length > 0) {
        const swapIndex = candidates[Math.floor(Math.random() * candidates.length)];

        // Perform swap
        flat[i] = newColor;
        flat[swapIndex] = originalColor;

        // Update index tracking
        colorIndices[originalColor].splice(colorIndices[originalColor].indexOf(i), 1);
        colorIndices[newColor].splice(colorIndices[newColor].indexOf(swapIndex), 1);
        colorIndices[newColor].push(i);
        colorIndices[originalColor].push(swapIndex);
      }
    }
  }

  // Convert back to 5x5 board
  const mutated: string[][] = [];
  for (let i = 0; i < 5; i++) {
    mutated.push(flat.slice(i * 5, (i + 1) * 5));
  }

  return mutated;
}

// Roulette wheel selection
export function rouletteWheelSelection(population: Individual[]): Individual {
  const totalFitness = population.reduce((sum, ind) => sum + Math.max(0, ind.fitness), 0);
  
  if (totalFitness === 0) {
    return population[Math.floor(Math.random() * population.length)];
  }
  
  const pick = Math.random() * totalFitness;
  let current = 0;
  
  for (const individual of population) {
    current += Math.max(0, individual.fitness);
    if (current >= pick) {
      return individual;
    }
  }

  return population[population.length - 1];
}

// Main genetic algorithm runner
export function runGeneticAlgorithm(
  params: GAParams,
  speed: number,
  onUpdate: (state: AlgorithmState) => void
): NodeJS.Timeout {
  let population = generatePopulation(params.populationSize);
  let generation = 0;

  const evolve = () => {
    // Sort population by fitness
    population.sort((a, b) => b.fitness - a.fitness);
    const elites = population.slice(0, params.eliteCount);

    // Update state
    const currentState: AlgorithmState = {
      generation: generation + 1,
      bestBoard: elites[0].board,
      bestFitness: elites[0].fitness,
      isComplete: elites[0].fitness >= 10 || generation >= params.generations,
      populationSize: params.populationSize
    };

    onUpdate(currentState);

    // Check if we should stop
    if (currentState.isComplete) {
      return;
    }

    // Create new population
    const newPopulation: Individual[] = [...elites];

    while (newPopulation.length < params.populationSize) {
      const parent1 = rouletteWheelSelection(population);
      const parent2 = rouletteWheelSelection(population);
      const child = crossover(parent1.board, parent2.board);
      const mutated = mutate(child, params.mutationRate);
      
      newPopulation.push({
        board: mutated,
        fitness: fitness(mutated),
      });
    }

    population = newPopulation;
    generation++;
  };

  return setInterval(evolve, speed);
}
