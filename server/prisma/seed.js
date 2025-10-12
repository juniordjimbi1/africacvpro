const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyer la base d'abord (optionnel)
  console.log('🧹 Nettoyage de la base...');
  await prisma.download.deleteMany();
  await prisma.file.deleteMany();
  await prisma.order.deleteMany();
  await prisma.letter.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.template.deleteMany();

  // Créer des templates de CV
  const templates = await prisma.template.createMany({
    data: [
      {
        name: "Classique Moderne",
        description: "Design épuré et professionnel, 1 colonne, optimisé ATS",
        category: "MODERNE",
        tokensJson: JSON.stringify({
          primaryColor: "#0ea5e9",
          secondaryColor: "#64748b",
          fontFamily: "Inter",
          fontSize: "14px",
          lineHeight: "1.4"
        })
      },
      {
        name: "Executive",
        description: "Style corporate avec sidebar, parfait pour les cadres",
        category: "EXECUTIVE", 
        tokensJson: JSON.stringify({
          primaryColor: "#0369a1",
          secondaryColor: "#475569",
          fontFamily: "Georgia",
          fontSize: "13px",
          lineHeight: "1.35"
        })
      },
      {
        name: "Créatif",
        description: "Design moderne avec touches de couleur, 2 colonnes",
        category: "CREATIF",
        tokensJson: JSON.stringify({
          primaryColor: "#f59e0b", 
          secondaryColor: "#1e293b",
          fontFamily: "Inter",
          fontSize: "14px",
          lineHeight: "1.5"
        })
      }
    ]
  });

  console.log(`✅ ${templates.count} templates créés`);

  // Créer un utilisateur admin
  const bcrypt = require('bcryptjs');
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      email: 'admin@africacvpro.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  // Créer un utilisateur test
  const userPassword = await bcrypt.hash('user123', 12);
  const testUser = await prisma.user.create({
    data: {
      email: 'test@africacvpro.com',
      password: userPassword,
      role: 'USER'
    }
  });

  console.log('✅ Utilisateurs créés');
  console.log('📧 Admin: admin@africacvpro.com / admin123');
  console.log('👤 Test: test@africacvpro.com / user123');

  console.log('🌱 Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur durante le seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });