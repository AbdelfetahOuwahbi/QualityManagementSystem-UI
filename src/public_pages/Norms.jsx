import React, { useEffect, useRef } from 'react'
import { Card } from 'flowbite-react'
import IsoImage from '../assets/Iso9001_Image.png'
import Charts from '../assets/Charts.png'
import { motion, useScroll } from 'framer-motion'

export default function Norms() {

  // Defining Some Animation Properties
  const myRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target : myRef,
    offset : ["0 1", "0.7 1"],
  })


  const Norms = [
    {
      id: 1,
      image: IsoImage,
      title: "ISO 9001",
      description: "QUALITÉ & AMÉLIORATION CONTINUE"
    },
    // {
    //   id: 2,
    //   image: Charts,
    //   title: "ISO 90010",
    //   description: "Ya salaaaam 3aliiik"
    // }
  ]

  return (
    <>
      {/* Norms and summary section Starts */}
      <motion.div ref={myRef} style={{scale : scrollYProgress, opacity : scrollYProgress}} className='md:px-14 px-4 py-7 w-full max-w-screen-2xl flex flex-col items-center justify-center' id='preview'>
        <div

          className='text-center my-8'>
          <h2 className='text-3xl font-p_semi_bold text-neutral-500 mb-2'>Norme ISO 9001</h2>
          <p className='font-p_light text-neutral-500'>Garantie de Qualité</p>
        </div>
        <div className='my-12 flex flex-wrap items-center justify-between gap-8'>
          {/* We can add more elements on the future :) */}
          {Norms.map((norm) =>
            <Card
              key={norm.id}
              className="max-w-sm h-[30rm] duration-300 hover:translate-y-[-4px] cursor-pointer hover:shadow-lg hover:border-b-4 hover:border-sky-400"
              imgSrc={norm.image}
            >
              <h5 className="text-2xl font-p_medium tracking-tight text-center text-gray-900 dark:text-white">
                {norm.title}
              </h5>
              <p className="font-p_light text-gray-700 text-center dark:text-gray-400">
                {norm.description}
              </p>
            </Card>
          )}
        </div>
        {/* Small summary about the app */}
        <div className='w-full px-4 md:px-14 py-7 text-center'>
          <div className='border-t border-gray-300 py-4'></div>
          <p className='font-p_regular text-sm pb-7'>
            Notre solution de gestion QSE combine une interface simple à utiliser pour vous procurer un avantage
            concurrentiel distinctif. Grâce à notre plateforme numérique et intuitive, vous pouvez automatiser vos processus,
            améliorer votre conformité réglementaire et optimiser les performances de votre entreprise. Obtenez une vue
            d'ensemble complète de vos opérations QSE, repérez rapidement les possibilités d'amélioration et prenez des décisions
            éclairées en temps réel. Notre solution transforme votre approche QSE en réduisant les coûts, en minimisant les risques
            et en renforçant votre réputation en matière de durabilité. Faites progresser votre gestion QSE vers l'avenir avec notre
            partenaire technologique.
          </p>
          <div className='border-t border-gray-300'></div>
        </div>
      </motion.div>
      {/* Norms and summary section Ends */}
    </>
  )
}
