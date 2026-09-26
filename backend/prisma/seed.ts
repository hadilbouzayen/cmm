import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const hash = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@cmm.tn" },
    update: {},
    create: { email: "admin@cmm.tn", password: hash, name: "Administrateur CMM" },
  });

  // Categories
  const langues = await prisma.category.upsert({
    where: { slug: "langues" },
    update: {},
    create: { name: "Langues", slug: "langues", status: "active" },
  });
  const formation = await prisma.category.upsert({
    where: { slug: "formation-professionnelle" },
    update: {},
    create: { name: "Formation professionnelle", slug: "formation-professionnelle", status: "active" },
  });
  const allemagne = await prisma.category.upsert({
    where: { slug: "allemagne-ausbildung" },
    update: {},
    create: { name: "Allemagne / Ausbildung", slug: "allemagne-ausbildung", status: "active" },
  });

  // Courses
  const courses = [
    {
      title: "Allemand", slug: "allemand", categoryId: langues.id, featured: true,
      shortDescription: "Cours en groupe ou individuels, expression orale, compréhension et préparation aux examens.",
      description: "Notre centre propose des cours d'allemand du niveau A1 au niveau B2, conformément au Cadre européen commun de référence pour les langues. Les programmes s'adressent aux étudiants, aux professionnels et aux personnes qui souhaitent étudier, travailler ou vivre en Allemagne.",
      objectives: JSON.stringify(["Développer l'expression orale et la compréhension", "Maîtriser la grammaire et le vocabulaire", "Préparer les certifications TELC, SECL, Goethe Zertifikat et ÖSD"]),
      program: JSON.stringify(["Cours en groupe dans une ambiance dynamique", "Cours individuels adaptés au niveau et aux objectifs", "Travail de l'expression orale et de la compréhension", "Préparation aux certifications internationales"]),
      level: "A1 à B2", requirements: JSON.stringify([]), includedItems: JSON.stringify(["Supports pédagogiques", "Suivi personnalisé"]),
    },
    {
      title: "Anglais", slug: "anglais", categoryId: langues.id,
      shortDescription: "Du niveau débutant à avancé : conversation, anglais professionnel et préparation internationale.",
      description: "Nous proposons des cours d'anglais pour tous les niveaux, du débutant au niveau avancé, avec des méthodes modernes et interactives adaptées aux besoins de chaque étudiant.",
      objectives: JSON.stringify(["Développer les 4 compétences : speaking, listening, reading, writing", "Maîtriser l'anglais professionnel", "Préparer les certifications IELTS, TOEIC et TOEFL"]),
      program: JSON.stringify(["Cours en groupe ou individuels", "Formations intensives", "Communication et conversation", "Anglais professionnel"]),
      level: "Débutant à avancé", requirements: JSON.stringify([]), includedItems: JSON.stringify(["Supports pédagogiques"]),
    },
    {
      title: "Français", slug: "francais", categoryId: langues.id,
      shortDescription: "Améliorez votre expression, votre compréhension et votre communication.",
      description: "Formation destinée aux débutants et aux personnes souhaitant améliorer leur expression orale, leur expression écrite, leur compréhension et leur communication.",
      objectives: JSON.stringify(["Améliorer l'expression orale et écrite", "Développer la compréhension", "Renforcer la communication"]),
      program: JSON.stringify(["Évaluation du niveau", "Apprentissage progressif", "Mise en pratique"]),
      level: "Tous niveaux", requirements: JSON.stringify([]), includedItems: JSON.stringify(["Supports pédagogiques"]),
    },
    {
      title: "Italien", slug: "italien", categoryId: langues.id,
      shortDescription: "Apprenez la langue et découvrez sa culture par la conversation et l'écriture.",
      description: "Une formation pour apprendre la langue italienne et découvrir sa culture, avec un travail progressif sur la conversation, la compréhension et l'écriture.",
      objectives: JSON.stringify(["Acquérir les bases de l'italien", "Développer la conversation", "Découvrir la culture italienne"]),
      program: JSON.stringify(["Évaluation du niveau", "Apprentissage progressif", "Mise en pratique"]),
      level: "Tous niveaux", requirements: JSON.stringify([]), includedItems: JSON.stringify(["Supports pédagogiques"]),
    },
    {
      title: "Espagnol", slug: "espagnol", categoryId: langues.id,
      shortDescription: "Développez votre aisance à l'oral et à l'écrit dans un cadre interactif.",
      description: "Apprenez l'espagnol dans un cadre dynamique et interactif afin de développer vos compétences à l'oral et à l'écrit pour voyager, étudier ou travailler.",
      objectives: JSON.stringify(["Maîtriser les bases de l'espagnol", "Développer la communication orale et écrite", "Acquérir un vocabulaire pratique"]),
      program: JSON.stringify(["Évaluation du niveau", "Apprentissage progressif", "Mise en pratique"]),
      level: "Tous niveaux", requirements: JSON.stringify([]), includedItems: JSON.stringify(["Supports pédagogiques"]),
    },
    {
      title: "Néerlandais", slug: "neerlandais", categoryId: langues.id,
      shortDescription: "Progressez pour faciliter un projet d'études, de travail ou d'intégration.",
      description: "Cours du niveau débutant au niveau avancé pour améliorer la communication, faciliter l'intégration et préparer un projet d'études ou de travail à l'international.",
      objectives: JSON.stringify(["Acquérir les bases du néerlandais", "Améliorer la communication", "Faciliter l'intégration internationale"]),
      program: JSON.stringify(["Évaluation du niveau", "Apprentissage progressif", "Mise en pratique"]),
      level: "Tous niveaux", requirements: JSON.stringify([]), includedItems: JSON.stringify(["Supports pédagogiques"]),
    },
    {
      title: "Broderie", slug: "broderie", categoryId: formation.id, featured: true,
      shortDescription: "Maîtrisez les points essentiels et réalisez progressivement vos propres créations.",
      description: "Apprenez l'art de la broderie et développez votre créativité grâce à des techniques simples et modernes. La formation permet de maîtriser les points essentiels et de réaliser progressivement vos propres créations.",
      objectives: JSON.stringify(["Maîtriser les points essentiels de la broderie", "Réaliser des créations personnalisées", "Développer la créativité"]),
      program: JSON.stringify(["Introduction aux outils et matériaux", "Techniques de base", "Projets progressifs", "Création libre"]),
      level: "Débutant", requirements: JSON.stringify(["Aucun prérequis"]), includedItems: JSON.stringify(["Matériel de base inclus"]),
    },
    {
      title: "Crochet", slug: "crochet", categoryId: formation.id,
      shortDescription: "Créez accessoires, vêtements et objets décoratifs faits à la main.",
      description: "Cette formation est dédiée à l'apprentissage du crochet. Les participants apprennent à créer des accessoires, des vêtements et des objets décoratifs faits à la main, tout en développant leur créativité et leur savoir-faire artisanal.",
      objectives: JSON.stringify(["Maîtriser les techniques de base du crochet", "Créer des accessoires et vêtements", "Développer le savoir-faire artisanal"]),
      program: JSON.stringify(["Introduction aux outils", "Points de base", "Projets progressifs", "Création libre"]),
      level: "Débutant", requirements: JSON.stringify(["Aucun prérequis"]), includedItems: JSON.stringify(["Matériel de base inclus"]),
    },
    {
      title: "Bougies parfumées", slug: "bougies-parfumees", categoryId: formation.id,
      shortDescription: "Découvrez les matières premières, les parfums et les méthodes de création artisanale.",
      description: "Découvrez les techniques de fabrication de bougies décoratives et parfumées. La formation aborde le choix des matières premières, l'utilisation des parfums et les principales méthodes de création artisanale.",
      objectives: JSON.stringify(["Connaître les matières premières", "Maîtriser les techniques de fabrication", "Créer des bougies personnalisées"]),
      program: JSON.stringify(["Introduction aux matières premières", "Techniques de fabrication", "Travail des parfums", "Création et finition"]),
      level: "Débutant", requirements: JSON.stringify(["Aucun prérequis"]), includedItems: JSON.stringify(["Matériel de base inclus"]),
    },
  ];

  for (const c of courses) {
    const { slug: _slug, ...rest } = c as typeof c & { slug?: string };
    const existing = await prisma.course.findFirst({ where: { title: rest.title } });
    if (existing) continue;
    await prisma.course.create({
      data: {
        ...rest,
        status: "active",
        availablePlaces: 12,
        price: "Sur demande",
        location: "Créateur Centre Monastir",
        instructor: "Équipe pédagogique CMM",
        duration: "À confirmer",
        schedule: "À confirmer",
      },
    });
  }

  // Germany opportunities
  const opportunities = [
    {
      title: "Formation paramédicale en Allemagne",
      type: "Ausbildung",
      description: "Un parcours théorique et pratique au sein d'établissements de santé allemands afin de former des professionnels répondant aux exigences du secteur.",
      requirements: JSON.stringify(["Niveau d'allemand B1 minimum", "Conditions à valider avant publication"]),
      germanLevel: "B1 minimum",
      duration: "À confirmer",
      ageRequirement: "À confirmer",
      location: "Allemagne",
      sessions: "Avril et octobre — à confirmer",
      benefits: JSON.stringify(["Accompagnement administratif", "Préparation linguistique", "Aide à l'intégration"]),
      status: "active",
    },
    {
      title: "Ausbildung LKW Fahrer",
      type: "Ausbildung",
      description: "Devenez conducteur de camion en Allemagne grâce à une formation professionnelle reconnue. Le parcours dure trois ans et combine apprentissage théorique et expérience pratique en entreprise dans le secteur du transport et de la logistique.",
      requirements: JSON.stringify(["Expérience dans le domaine obligatoire", "Niveau d'allemand B1", "Âge maximum 33 ans"]),
      germanLevel: "B1",
      duration: "3 ans",
      ageRequirement: "33 ans maximum",
      location: "Allemagne",
      sessions: "À confirmer",
      benefits: JSON.stringify(["Formation rémunérée", "Expérience professionnelle en Allemagne", "Perspectives d'emploi après la formation", "Accompagnement administratif et linguistique"]),
      status: "active",
    },
    {
      title: "Opportunités médicales et paramédicales",
      type: "Emploi",
      description: "Accompagnement pour les infirmiers, instrumentistes et techniciens en radiologie souhaitant exercer en Allemagne.",
      requirements: JSON.stringify(["Diplôme dans la spécialité", "Conditions exactes à confirmer"]),
      germanLevel: "À confirmer",
      duration: "Selon le parcours",
      ageRequirement: "À confirmer",
      location: "Allemagne",
      sessions: "Selon disponibilité",
      benefits: JSON.stringify(["Reconnaissance du diplôme", "Préparation en allemand", "Mise en relation avec des établissements", "Suivi jusqu'à l'installation"]),
      status: "active",
    },
  ];

  for (const opp of opportunities) {
    const existing = await prisma.germanyOpportunity.findFirst({ where: { title: opp.title } });
    if (!existing) await prisma.germanyOpportunity.create({ data: opp });
  }

  // Testimonials
  const testimonials = [
    { name: "Eya Cherni", testimonial: "Service excellent et équipe chaleureuse. Je recommande.", language: "Français", published: false },
    { name: "Aymen Sakka", testimonial: "Un service remarquable. Je le conseille à tous.", language: "Français", published: false },
    { name: "Maryem Mousa", testimonial: "Comme toujours, ce fut un honneur de vous retrouver. Je recommande fortement.", language: "Français", published: false },
    { name: "Farah Zaghdoudi", testimonial: "Amazing service and very professional.", language: "Anglais", published: false },
    { name: "Malak Eltaief", testimonial: "Very professional center. I strongly recommend it.", language: "Anglais", published: false },
    { name: "Yassine Khaled", testimonial: "J'ai été très satisfait de mon expérience.", language: "Français", published: false },
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  // Homepage content
  const existingHomepage = await prisma.homepageContent.findFirst();
  if (!existingHomepage) {
    await prisma.homepageContent.create({
      data: {
        heroTitle: "Le partenaire de votre réussite",
        heroSubtitle: "Créateur Centre Monastir",
        heroDescription: "Formations en langues, formations professionnelles et accompagnement vers les études ou l'emploi en Allemagne.",
        germanyTitle: "Démarrez votre carrière en Allemagne",
        germanyText: "Créateur Centre vous accompagne dans l'apprentissage de l'allemand, la préparation de votre dossier et la recherche d'une opportunité de formation ou de travail en Allemagne.",
        ctaTitle: "Parlons de votre projet",
        ctaText: "Notre équipe vous aide à choisir le parcours adapté à votre objectif.",
      },
    });
  }

  // Website settings
  const existingSettings = await prisma.websiteSettings.findFirst();
  if (!existingSettings) {
    await prisma.websiteSettings.create({
      data: {
        centerName: "Créateur Centre Monastir",
        phone: "52 291 722",
        whatsapp: "52 291 722",
        email: "createur.center@gmail.com",
        address: "Immeuble Ghomrassi, Monastir",
        openingHours: "Lun–Ven 9h–17h · Sam 9h–14h · Dim fermé",
        facebookUrl: "https://facebook.com/CreateurCentreMonastirCCM",
        instagramUrl: "https://instagram.com/createurcentre",
        tiktokUrl: "https://tiktok.com/@crateur.centre.mo",
        footerText: "Formations, accompagnement et opportunités internationales.",
      },
    });
  }

  console.log("Seed terminé.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
