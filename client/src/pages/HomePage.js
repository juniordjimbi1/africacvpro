import React from 'react';
import { motion } from 'framer-motion';
import { SectionTitle } from '../components/ui/SectionTitle';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { StaggerChildren } from '../components/animations/StaggerChildren';
import { HoverCard } from '../components/animations/HoverCard';
import { FadeIn } from '../components/animations/FadeIn';
import { go } from '../utils/nav';

function HeroSection() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center py-8">
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="space-y-4">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Créez un CV qui <span className="text-primary-600">vous représente</span> vraiment
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Optimisé ATS • Aperçu gratuit • Paiement après validation • Livraison WhatsApp
          </motion.p>
        </div>
        
        <motion.div 
          className="flex flex-wrap gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button 
            onClick={() => { 
              // Démarrage propre du flow “Créer mon CV” vers Modèles
              localStorage.removeItem("africacv_template_id"); 
              localStorage.removeItem("africacv_offer");
              sessionStorage.removeItem('africacv_open_offer_on_templates');
              go("Modèles"); 
            }}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(14, 165, 233, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            Créer mon CV
          </motion.button>

          <motion.button 
            onClick={() => { 
              // Accès direct à la page Modèles
              sessionStorage.removeItem('africacv_open_offer_on_templates');
              go("Modèles");
            }}
            className="border border-slate-300 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Voir les modèles
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3 text-sm text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div 
            className="w-2 h-2 bg-success-500 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <span>Compatible ATS • Aperçu gratuit • Paiement après validation • WhatsApp</span>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, x: 50, rotateY: 10 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <motion.div 
          className="aspect-[210/297] w-full max-w-md border-2 border-dashed border-slate-300 rounded-2xl bg-white shadow-xl grid place-items-center relative overflow-hidden"
          whileHover={{ 
            y: -10,
            transition: { duration: 0.3 }
          }}
        >
          {/* Effet de brillance subtile */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"
            animate={{ x: [-100, 300] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
          <span className="text-slate-400 text-sm relative z-10">Aperçu CV A4 - Design professionnel</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

function StepsSection() {
  const steps = [
    { number: "01", title: "Choisissez", desc: "Votre modèle préféré" },
    { number: "02", title: "Sélectionnez", desc: "L’offre (Auto / IA / Humain)" },
    { number: "03", title: "Remplissez", desc: "Vos informations" },
    { number: "04", title: "Recevez", desc: "Sur WhatsApp" },
  ];

  return (
    <StaggerChildren className="grid md:grid-cols-4 gap-6 py-8">
      {steps.map((step, index) => (
        <HoverCard key={index}>
          <Card className="text-center p-6 relative overflow-hidden group">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4 relative z-10"
              whileHover={{ 
                scale: 1.1,
                rotate: 5,
                backgroundColor: "rgb(14, 165, 233)",
                color: "white"
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {step.number}
            </motion.div>
            <motion.h3 
              className="font-semibold text-slate-900 mb-2 relative z-10"
              whileHover={{ color: "rgb(14, 165, 233)" }}
            >
              {step.title}
            </motion.h3>
            <motion.p 
              className="text-sm text-slate-600 relative z-10"
              whileHover={{ color: "rgb(51, 65, 85)" }}
            >
              {step.desc}
            </motion.p>
          </Card>
        </HoverCard>
      ))}
    </StaggerChildren>
  );
}

// Teaser d'offres (sans prix)
function OffersTeaserSection() {
  const items = [
    {
      name: "Automatique",
      badge: "Rapide",
      desc: "Générez rapidement un CV propre à partir d’un modèle. Idéal pour démarrer en quelques minutes.",
      highlight: false,
    },
    {
      name: "Optimisée IA",
      badge: "Recommandé",
      desc: "L’IA vous accompagnera par des questions ciblées pour adapter le CV au métier/annonce (bientôt).",
      highlight: true,
    },
    {
      name: "Service Professionnel",
      badge: "Premium",
      desc: "Un professionnel améliore votre CV, corrige la forme et le fond. Échanges personnalisés via WhatsApp.",
      highlight: false,
    },
  ];

  return (
    <StaggerChildren className="grid md:grid-cols-3 gap-8 py-8">
      {items.map((it, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -10 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Card className={`p-6 relative overflow-hidden group h-full ${it.highlight ? 'ring-2 ring-primary-500 shadow-xl' : ''}`}>
            {it.highlight && (
              <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-300"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              />
            )}

            {it.highlight && (
              <div className="mb-2">
                <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  RECOMMANDÉ
                </span>
              </div>
            )}

            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{it.name}</h3>
              <span className={`text-xs px-3 py-1 rounded-full ${
                it.highlight ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {it.badge}
              </span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">{it.desc}</p>

            <motion.button 
              onClick={() => go('Offres')}
              className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors relative overflow-hidden ${
                it.highlight 
                  ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              whileHover={{ 
                scale: 1.02,
                boxShadow: it.highlight ? "0 10px 25px -5px rgba(14, 165, 233, 0.4)" : "0 5px 15px -3px rgba(0, 0, 0, 0.1)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              Découvrir l’offre
            </motion.button>
          </Card>
        </motion.div>
      ))}
    </StaggerChildren>
  );
}

export function HomePage() {
  return (
    <motion.div 
      className="space-y-16 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeroSection />
      
      <FadeIn>
        <section>
          <SectionTitle title="Comment ça marche en 4 étapes" />
          <StepsSection />
        </section>
      </FadeIn>

      <FadeIn delay={0.2}>
        <section>
          <SectionTitle title="Nos modèles populaires" />
          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <HoverCard key={item}>
                <Card
                  onClick={() => {
                    // depuis la Home : pré-sélection du modèle, on bascule vers Modèles
                    const tplId = `template-${item}`;
                    localStorage.setItem('africacv_template_id', tplId);
                    // L’offre n’est pas encore connue → elle sera demandée sur Modèles
                    go('Modèles');
                  }}
                  className="cursor-pointer"
                >
                  <motion.div 
                    className="aspect-[210/297] border-2 border-dashed border-slate-300 rounded-lg bg-white mb-4 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Animation de chargement simulée */}
                    <motion.div
                      className="h-full bg-gradient-to-br from-slate-100 to-slate-200"
                      animate={{ 
                        background: [
                          'linear-gradient(45deg, #f1f5f9, #e2e8f0)',
                          'linear-gradient(45deg, #e2e8f0, #f1f5f9)',
                          'linear-gradient(45deg, #f1f5f9, #e2e8f0)',
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div className="space-y-3">
                    <Skeleton w={180} h={20} />
                    <div className="flex gap-2">
                      <Skeleton w={80} h={32} />
                      <Skeleton w={80} h={32} />
                    </div>
                  </div>

                  {/* Bouton explicite sous la carte */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const tplId = `template-${item}`;
                        localStorage.setItem('africacv_template_id', tplId);
                        go('Modèles');
                      }}
                      className="w-full rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 transition-colors"
                    >
                      Choisir ce modèle
                    </button>
                  </div>
                </Card>
              </HoverCard>
            ))}
          </StaggerChildren>
        </section>
      </FadeIn>

      <FadeIn delay={0.3}>
        <section>
          <SectionTitle title="Nos offres adaptées à vos besoins" />
          <OffersTeaserSection />
        </section>
      </FadeIn>

      <FadeIn delay={0.4}>
        <section>
          <SectionTitle title="Ils nous recommandent" />
          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <HoverCard key={item}>
                <Card>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`text-lg ${i < 4 ? "text-yellow-400" : "text-slate-300"}`}
                        whileHover={{ 
                          scale: 1.3,
                          rotate: i < 4 ? [0, -10, 10, 0] : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        ★
                      </motion.div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <Skeleton w={260} h={16} />
                    <Skeleton w={180} h={16} />
                  </div>
                </Card>
              </HoverCard>
            ))}
          </StaggerChildren>
        </section>
      </FadeIn>
    </motion.div>
  );
}
