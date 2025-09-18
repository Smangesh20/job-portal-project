'use client';

import { motion } from 'framer-motion';
import { 
  BeakerIcon, 
  CpuChipIcon, 
  ChartBarIcon, 
  GlobeAltIcon,
  LightBulbIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

export function ResearchSection() {
  const researchAreas = [
    {
      icon: BeakerIcon,
      title: "Quantum Computing Research",
      description: "Exploring quantum algorithms for job matching and optimization problems.",
      features: ["Quantum Annealing", "Qubit Optimization", "Quantum ML"]
    },
    {
      icon: CpuChipIcon,
      title: "Quantum Computing & Machine Learning",
      description: "Advanced quantum neural networks and deep learning for career prediction.",
      features: ["Deep Learning", "NLP Processing", "Predictive Analytics"]
    },
    {
      icon: ChartBarIcon,
      title: "Data Science & Analytics",
      description: "Big data analysis and statistical modeling for job market insights.",
      features: ["Big Data", "Statistical Modeling", "Market Analysis"]
    },
    {
      icon: GlobeAltIcon,
      title: "Global Market Research",
      description: "International job market trends and cross-cultural career insights.",
      features: ["Market Trends", "Global Analysis", "Cultural Insights"]
    },
    {
      icon: LightBulbIcon,
      title: "Innovation Lab",
      description: "Cutting-edge research in human-quantum computing collaboration and future work.",
      features: ["Human-Quantum Computing Collaboration", "Future Work", "Innovation"]
    },
    {
      icon: RocketLaunchIcon,
      title: "Technology Advancement",
      description: "Next-generation technologies for the future of recruitment.",
      features: ["Emerging Tech", "Future Recruitment", "Tech Innovation"]
    }
  ];

  const stats = [
    { label: "Research Papers Published", value: "50+" },
    { label: "Quantum Computing Models Developed", value: "25+" },
    { label: "Quantum Algorithms", value: "12+" },
    { label: "Global Partnerships", value: "30+" }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pioneering the Future of
            <span className="text-blue-600 block">Job Matching Research</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our dedicated research team is pushing the boundaries of quantum computing, 
            artificial intelligence, and data science to revolutionize how people find their dream careers.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Research Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {researchAreas.map((area, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <area.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 ml-4">
                  {area.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {area.description}
              </p>
              
              <div className="space-y-2">
                {area.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join Our Research Community
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Collaborate with leading researchers and contribute to the future of 
              quantum-powered job matching technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                View Research Papers
              </button>
              <button className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                Partner With Us
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
