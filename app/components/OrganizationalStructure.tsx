import Image from 'next/image'
import { User, Users, Briefcase, Cpu } from 'lucide-react'
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

function OrgChartItem({ member }: { member: OrgMember }) {
  const Icon = member.icon;
  return (
    <div className="org-chart-item flex flex-col items-center p-4 sm:p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 transform">
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 mb-3 sm:mb-4 rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900">
        <Image
          src={member.photo}
          alt={member.name}
          fill
          sizes="(max-width: 768px) 80px, 112px"
          className="rounded-full object-cover transform transition-transform duration-300 hover:scale-110"
          onError={() => {
            const imgElement = document.querySelector(`[alt="${member.name}"]`) as HTMLImageElement;
            if (imgElement) {
              imgElement.src = '/team/placeholder.jpg';
            }
          }}
          priority
        />
      </div>
      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
        {member.name}
      </h3>
      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 text-center">
        {member.position}
      </p>
      <div className="p-1.5 sm:p-2 bg-blue-50 dark:bg-blue-900/30 rounded-full">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
      </div>
    </div>
  );
}

export default function OrganizationalStructure() {
  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${styles.orgChart}`}>
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
          Organizational Structure
        </h2>
        <div className="org-chart">
          <ul className="space-y-8">
            <li>
              <OrgChartItem member={orgData[0]} />
              <ul>
                <li>
                  <OrgChartItem member={orgData[1]} />
                  <ul>
                    <li>
                      <OrgChartItem member={orgData[2]} />
                    </li>
                    <li>
                      <OrgChartItem member={orgData[3]} />
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

