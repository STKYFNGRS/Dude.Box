'use client';

import { useState, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

type CategoryType = 'HEAD' | 'FACE' | 'BODY' | 'CLOTHING' | 'NEURAL_INTERFACE' | 'ENERGY_CORE' | 'AURA';
type RarityTier = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';

interface DBTrait {
  id: number;
  category: CategoryType;
  trait_type: string;
  display_name: string;
  rarity_score: number;
  rarity_tier: RarityTier;
  color_variants: string;
  metadata_key: string;
  description: string;
}

type TraitsByCategory = Record<CategoryType, DBTrait[]>;

const TRAIT_CATEGORIES: CategoryType[] = [
  'HEAD',
  'FACE',
  'BODY',
  'CLOTHING',
  'NEURAL_INTERFACE',
  'ENERGY_CORE',
  'AURA'
];

const MintInterface = () => {
  const [traits, setTraits] = useState<TraitsByCategory | null>(null);
  const [selectedTraits, setSelectedTraits] = useState<Record<CategoryType, DBTrait | null>>({
    HEAD: null,
    FACE: null,
    BODY: null,
    CLOTHING: null,
    NEURAL_INTERFACE: null,
    ENERGY_CORE: null,
    AURA: null
  });
  const [selectedColors, setSelectedColors] = useState<Record<CategoryType, string>>({} as Record<CategoryType, string>);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRandomColorVariant = (colorVariants: string): string => {
    const variants = colorVariants.split(',').map(v => v.trim());
    return variants[Math.floor(Math.random() * variants.length)];
  };

  const selectTraitByRarity = (traits: DBTrait[]): DBTrait => {
    const roll = Math.random() * 100;
    let cumulativeProbability = 0;
    
    for (const trait of traits) {
      cumulativeProbability += trait.rarity_score;
      if (roll <= cumulativeProbability) {
        return trait;
      }
    }
    
    return traits[0];
  };

  const generateNewCombination = () => {
    console.log('Generating new combination');
    console.log('Current traits:', traits);

    if (!traits) {
      console.log('No traits data available');
      return;
    }

    const newTraits: Record<CategoryType, DBTrait | null> = {} as Record<CategoryType, DBTrait | null>;
    const newColors: Record<CategoryType, string> = {} as Record<CategoryType, string>;

    TRAIT_CATEGORIES.forEach(category => {
      const categoryTraits = traits[category];
      console.log(`Processing category ${category}:`, categoryTraits);

      if (categoryTraits && categoryTraits.length > 0) {
        const selectedTrait = selectTraitByRarity(categoryTraits);
        console.log(`Selected trait for ${category}:`, selectedTrait);
        newTraits[category] = selectedTrait;
        newColors[category] = getRandomColorVariant(selectedTrait.color_variants);
      } else {
        console.log(`No traits found for category ${category}`);
        newTraits[category] = null;
        newColors[category] = '';
      }
    });

    console.log('New traits selected:', newTraits);
    setSelectedTraits(newTraits);
    setSelectedColors(newColors);
  };

  useEffect(() => {
    const loadTraits = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/traits');
        if (!response.ok) throw new Error('Failed to fetch traits');
        
        const data: DBTrait[] = await response.json();
        console.log('Fetched trait data:', data);
        
        // Initialize grouped traits with empty arrays
        const grouped: TraitsByCategory = TRAIT_CATEGORIES.reduce((acc, category) => {
          acc[category] = [];
          return acc;
        }, {} as TraitsByCategory);

        // Group traits by category
        data.forEach(trait => {
          if (trait.category in grouped) {
            grouped[trait.category].push(trait);
          }
        });

        console.log('Grouped traits:', grouped);
        setTraits(grouped);
        
        // Generate initial combination after a short delay
        setTimeout(() => {
          setIsLoading(false);
          generateNewCombination();
        }, 100);
      } catch (err) {
        console.error('Error loading traits:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    loadTraits();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="w-full flex flex-col items-center justify-center p-8">
          <div className="bg-blue-900/20 p-4 rounded-full mb-4">
            <ImageIcon className="w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-blue-300 mb-2">Loading Traits...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto">
        <div className="bg-red-900/50 rounded-2xl border border-red-900/30 backdrop-blur-sm p-6">
          <h3 className="text-xl font-semibold text-red-300 mb-2">Error Loading Traits</h3>
          <p className="text-red-200">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-red-900/50 hover:bg-red-900/70 text-red-300 font-semibold py-2 px-4 rounded-xl border border-red-900/30">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-gray-900/50 rounded-2xl border border-blue-900/30 backdrop-blur-sm p-6 mb-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-blue-300">Trait Preview</h3>
          <div className="space-y-3">
            {TRAIT_CATEGORIES.map((category) => {
              const trait = selectedTraits[category];
              const color = selectedColors[category];
              return (
                <div key={category} className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-400">{category.replace('_', ' ')}</span>
                    {trait && (
                      <div className="flex items-center">
                        <span className={
                          trait.rarity_tier === 'Legendary' ? 'text-yellow-300' : 
                          trait.rarity_tier === 'Epic' ? 'text-purple-300' :
                          trait.rarity_tier === 'Rare' ? 'text-blue-300' :
                          trait.rarity_tier === 'Uncommon' ? 'text-green-300' :
                          'text-gray-300'
                        }>{trait.rarity_tier}</span>
                        <span className="text-gray-400 ml-2">{trait.rarity_score}%</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-blue-100 font-medium">
                      {trait ? trait.display_name : 'No trait selected'}
                    </div>
                    <div className="text-blue-400 text-sm">
                      {color || '-'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => {
            console.log('Generate button clicked');
            generateNewCombination();
          }}
          className="w-full bg-blue-900/50 hover:bg-blue-900/70 text-blue-300 font-semibold py-4 rounded-xl border border-blue-900/30 backdrop-blur-sm transition-all duration-200"
        >
          Generate New Combination
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Built on Base • {TRAIT_CATEGORIES.length} Trait Categories
          </p>
        </div>
      </div>
    </div>
  );
};

export default MintInterface;