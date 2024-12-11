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
    name: "M. Shoufi Rakhmatullah",
    position: "Direktur Utama",
    photo: "/team/dir.jpg",
    icon: User
  },
  {
    name: "Jane Smith",
    position: "Ahmad Fanshury",
    photo: "/team/wakdir.jpg",
    icon: Users
  },
  {
    name: "Ghaniy Sriyanto",
    position: "Product Manager & Marketing",
    photo: "/team/mark.jpg",
    icon: Briefcase
  },
  {
    name: "Khairun Rizaldy",
    position: "Product Manager & Technology",
    photo: "/team/tech.jpg",
    icon: Cpu
  }
];

export default function OrganizationalStructure() {
  return (
    <div className={styles.orgChart}>
      <ul>
        {orgData.map((member, index) => (
          <motion.li
            key={member.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={styles.memberCard}
          >
            <div className={styles.memberContent}>
              <div className={styles.photoContainer}>
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={120}
                  height={120}
                  className={styles.memberPhoto}
                />
                <div className={styles.iconWrapper}>
                  <member.icon className={styles.memberIcon} />
                </div>
              </div>
              <h3 className={styles.memberName}>{member.name}</h3>
              <p className={styles.memberPosition}>{member.position}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

