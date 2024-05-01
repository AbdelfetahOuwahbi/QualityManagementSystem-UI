import React, { useState, useRef } from 'react'
import { motion, useScroll } from 'framer-motion';
import { Card } from 'flowbite-react'
import { FaPersonWalkingArrowRight } from "react-icons/fa6";
import Contact from './Contact';

export default function Services() {

  //Contact Modal visibility Controller
  const [modalVisible, setModalVisible] = useState(false);

  // Defining Some Animation Properties
  const myRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: myRef,
    offset: ["0 1", "1 1"],
  })

  const Services = [
    {
      id: 1,
      title: "Gestion des Processus",
      description: "Créez et gérez vos processus de manière intuitive et efficace, ce qui permet une meilleure organisation et une plus grande visibilité."
    },
    {
      id: 2,
      title: "Gestion des Risques",
      description: "Identifiez et gérez les risques de manière proactive pour une meilleure performance QSE."
    },
    {
      id: 3,
      title: "Gestion des Processus",
      description: "Planifiez et suivez vos audits avec facilité, garantissant une conformité continue."
    },
    {
      id: 4,
      title: "Gestion des Documents",
      description: "Gardez vos documents organisés et facilement accessibles grâce à la gestion automatisée des documents."
    },
    {
      id: 5,
      title: "Interface d'administrations IT",
      description: "Bénéficiez de notre interface d'administration IT dans notre SMQ, qui permet à l'administrateur de personnaliser efficacement les processus, les workflows et les paramètres du système"
    },
    {
      id: 6,
      title: "Voir plus ...",
      description: "Cliquer ici pour explorer encore plus de services"
    }
  ]
  return (
    <motion.div ref={myRef} style={{ scale: scrollYProgress, opacity: scrollYProgress }} className='w-full h-auto px-4 md:px-14 py-7' id='services'>

      <div

        className='text-center my-8'>
        <h2 className='text-3xl font-p_semi_bold text-neutral-500 mb-2'>Nos Services</h2>
        <p className='font-p_light text-neutral-500'>Gestion Multi-Standards, Multi-Utilisateurs, Multi-Processus et Multi-Site</p>
      </div>
      <div className='w-full h-auto flex md:flex-row flex-col flex-wrap gap-4'>
        {/* We can add more services here */}
        {Services.map((service) =>
          <Card
            key={service.id}
            onClick={() => service.title === "Voir plus ..." ? setModalVisible(!modalVisible) : null}
            className={`w-full md:w-[28rem] cursor-${service.title === "Voir plus ..." ? "pointer" : ""} hover:shadow-lg`}>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {service.title}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {service.description}
            </p>
            {service.title === "Voir plus ..." ? (
              <FaPersonWalkingArrowRight size={30} className='ml-80' />
            ) : (
              null
            )}
          </Card>
        )}
      </div>
      {modalVisible &&  <Contact onClose={() => setModalVisible(false)} />}
    </motion.div>
  )
}
