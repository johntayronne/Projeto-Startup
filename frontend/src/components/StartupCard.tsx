import Image from 'next/image';
import { motion } from 'framer-motion';
import { Building2, Users, Briefcase, TrendingUp } from 'lucide-react';

interface StartupProps {
  startup: {
    id: string;
    name: string;
    description: string;
    industry: string;
    stage: string;
    funding: number;
    teamSize: number;
  };
}

const stageColors = {
  IDEA: 'bg-blue-100 text-blue-800',
  MVP: 'bg-yellow-100 text-yellow-800',
  MARKET: 'bg-green-100 text-green-800',
  SCALE: 'bg-purple-100 text-purple-800',
};

export function StartupCard({ startup }: StartupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative h-48">
        <Image
          src={`https://source.unsplash.com/800x600/?startup,${startup.industry}`}
          alt={startup.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{startup.name}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${stageColors[startup.stage]}`}>
            {startup.stage}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{startup.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-600">
            <Building2 className="h-5 w-5 mr-2" />
            <span>{startup.industry}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="h-5 w-5 mr-2" />
            <span>{startup.teamSize} pessoas</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Briefcase className="h-5 w-5 mr-2" />
            <span>R$ {startup.funding.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <TrendingUp className="h-5 w-5 mr-2" />
            <span>{startup.stage}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 