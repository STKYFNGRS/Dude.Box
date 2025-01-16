'use client';

import { motion } from 'framer-motion';
import { Dumbbell, Gift, LucideIcon, Star, Users, Zap } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-blue-900/30 hover:border-blue-700/40 transition-colors"
  >
    <div className="flex flex-col items-center text-center">
      <div className="p-3 rounded-xl bg-blue-900/20 mb-4">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <h3 className="text-xl font-semibold text-blue-300 mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </motion.div>
);

const NFTValueProps = () => {
  return (
    <div className="w-full py-16">
      <div className="container mx-auto px-4">
        {/* Main Value Proposition */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-6"
          >
            Founding Member Benefits
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-gray-300"
          >
            As a founding member, you'll receive exclusive benefits and help shape the future of mental health support.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={Star}
            title="Priority Access"
            description="First access to new features and exclusive content before they're available to the public."
            delay={0.3}
          />
          <FeatureCard
            icon={Gift}
            title="Lifetime Rewards"
            description="Permanent discounts on all future products and services."
            delay={0.4}
          />
          <FeatureCard
            icon={Zap}
            title="Web3 Project Hosting"
            description="Dedicated server space allocation for your Web3 projects."
            delay={0.5}
          />
          <FeatureCard
            icon={Users}
            title="Advisory Board"
            description="Join our advisory board and help guide the development of new features and community initiatives."
            delay={0.6}
          />
          <FeatureCard
            icon={Users}
            title="Members-Only Events"
            description="Exclusive access to in-person and virtual community gatherings and networking opportunities."
            delay={0.7}
          />
          <FeatureCard
            icon={Dumbbell}
            title="Gym Access"
            description="Unlimited access to our state-of-the-art fitness facility."
            delay={0.8}
          />
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-500/20 rounded-full px-6 py-2">
            <span className="text-blue-300 font-medium">
              Join the founding members today
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NFTValueProps;