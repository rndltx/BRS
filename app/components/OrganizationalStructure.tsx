import Image from 'next/image'
import { User, Users, Briefcase, Cpu } from 'lucide-react'
import { motion } from 'framer-motion'
import styles from './OrganizationalStructure.module.css';

interface OrgMember {
  name: string;
  position: string;
  photo: string;
  icon: React.ElementType;
}

const orgData: OrgMember[] = [
  {
    name: "John Doe",
    position: "Direktur Utama",
    photo: "/team/dir.jpg",
    icon: User
  },
  {
    name: "Jane Smith",
    position: "Wakil Direktur",
    photo: "/team/wakdir.jpg",
    icon: Users
  },
  {
    name: "Mike Johnson",
    position: "Product Manager & Marketing",
    photo: "/team/mark.jpg",
    icon: Briefcase
  },
  {
    name: "Sarah Lee",
    position: "Product Manager & Technology",
    photo: "/team/tech.jpg",
    icon: Cpu
  }
];

function OrgChartItem({ member, index }: { member: OrgMember; index: number }) {
  const Icon = member.icon;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="org-chart-item w-full max-w-sm mx-auto p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transform"
    >
      <div className="flex items-center space-x-4">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 80px, 96px"
            className="rounded-full object-cover ring-4 ring-blue-100 dark:ring-blue-900 transform transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/team/placeholder.jpg';
            }}
            priority
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl sm:text-2xl font-bold mb-1 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent truncate">
            {member.name}
          </h3>
          <p className="text-sm sm:text-base font-medium text-gray-600 dark:text-gray-400 mb-2">
            {member.position}
          </p>
          <div className="inline-flex p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function OrganizationalStructure() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent"
        >
          Organizational Structure
        </motion.h2>
        <div className="space-y-6 sm:space-y-8">
          {orgData.map((member, index) => (
            <OrgChartItem key={member.name} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

