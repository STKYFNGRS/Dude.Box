import { motion } from 'framer-motion';
import { ChevronRight, Code, HelpCircle, LucideIcon, Rocket, Users } from 'lucide-react';
import React, { useState } from 'react';

type Status = 'completed' | 'current' | 'upcoming';

interface RoadmapPhase {
  phase: string;
  title: string;
  details: string[];
  icon: LucideIcon;
  status: Status;
}

interface RoadmapCardProps extends RoadmapPhase {
  isActive: boolean;
  onClick: () => void;
}

const roadmapData: RoadmapPhase[] = [
  {
    phase: 'Phase 1: Launch',
    title: 'Initial NFT Mint & Infrastructure',
    details: [
      'Smart contract deployment and testing',
      'Launch of 20,000 unique Dude Box NFTs',
      'Team expansion'
    ],
    icon: Rocket,
    status: 'current'
  },
  {
    phase: 'Phase 2: Property Acquisition',
    title: 'Property Acquisition & Development',
    details: [
      'Tax strategy implementation & compliance',
      'Commercial property acquisition',
      'Architectural design and permit acquisition',
      'Construction planning and build-out'
    ],
    icon: Code,
    status: 'upcoming'
  },
  {
    phase: 'Phase 3: Commence Operations',
    title: 'Ignition Sequence Start',
    details: [
      'Staff training and operational procedures',
      'Equipment procurement and setup',
      'Member experience refinement',
      'Web3 project server space allocation for NFT holders',
      'Grand opening preparations'
    ],
    icon: Users,
    status: 'upcoming'
  },
  {
    phase: 'Phase 4: ',
    title: '[REDACTED]',
    details: [
      '🎁 Operation Diamond Hands [SECRET]...',
      '💎 Operation Diamond Hands [CLASSIFIED]',
      '🌟 Operation Diamond Hands [REDACTED]',
      '🔮 Operation Diamond Hands [FOUO]',
      '🎯 Operation Diamond Hands [RESTRICTED]',
      '🚀 Operation Diamond Hands [CONFIDENTIAL]',
      '🤫 Operation Diamond Hands [TOP SECRET]...'
    ],
    icon: HelpCircle,
    status: 'upcoming'
  }
];

const RoadmapCard: React.FC<RoadmapCardProps> = ({ 
  phase, 
  title, 
  details, 
  icon: Icon, 
  status, 
  isActive, 
  onClick 
}) => {
  const statusColors: Record<Status, string> = {
    completed: 'bg-green-500',
    current: 'bg-green-500',
    upcoming: 'bg-gray-300'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`cursor-pointer rounded-lg p-6 ${isActive ? 'bg-opacity-10 bg-blue-500' : 'bg-opacity-5 bg-white'} 
                 backdrop-blur-sm transition-all duration-300 ease-in-out border 
                 ${isActive ? 'border-blue-500' : 'border-gray-800'}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full ${isActive ? 'bg-blue-500/20' : 'bg-black/20'}`}>
          <Icon className={`w-6 h-6 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{phase}</h3>
        </div>
        <div className={`ml-auto w-3 h-3 rounded-full ${statusColors[status]}`} />
      </div>
      
      <h4 className="text-white font-medium mb-3">{title}</h4>
      
      {isActive && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <p className="text-sm text-gray-300">Key Deliverables:</p>
            <ul className={`space-y-1 ${title === '[REDACTED]' ? 'blur-md select-none' : ''}`}>
              {details.map((detail, index) => (
                <li key={index} className="flex items-center text-sm text-gray-300">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const ProjectRoadmap: React.FC = () => {
  const [activePhase, setActivePhase] = useState(0);

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500 mb-4">Project Roadmap</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
          Pioneering a new era of community-driven wellness through Web3 technology
          </p>
        </div>

        <div className="grid gap-6 mb-8">
          {roadmapData.map((phase, index) => (
            <RoadmapCard
              key={index}
              {...phase}
              isActive={activePhase === index}
              onClick={() => setActivePhase(index)}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            * Roadmap is subject to adjustments based on market conditions and community feedback
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProjectRoadmap;